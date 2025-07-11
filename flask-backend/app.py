from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging
import firebase_admin
from firebase_admin import messaging
from firebase_admin import credentials, auth as firebase_auth, firestore
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import request
from email.mime.base import MIMEBase
from email import encoders
import requests

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

cred = credentials.Certificate("firebase-admin-sdk.json")  # your actual file
firebase_admin.initialize_app(cred)
db = firestore.client()
RECAPTCHA_SECRET_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained TensorFlow model
try:
    model = tf.keras.models.load_model("LettuceModelV2", compile=False)
    logger.info("✅ Model loaded successfully!")
except Exception as e:
    logger.error(f"❌ Error loading model: {e}")
    model = None

# Define class labels and recommendations
CLASS_LABELS = ["Bacterial", "Fungal", "Healthy", "Cant Classified"]

RECOMMENDATIONS = {
    "Bacterial": [
        "Apply copper-based bactericides as a preventative measure",
        "Ensure proper spacing between plants for good air circulation",
        "Remove and destroy infected plants to prevent spread",
        "Avoid overhead irrigation to reduce leaf wetness",
        "Rotate crops with non-host plants for at least 2 years"
    ],
    "Fungal": [
        "Apply appropriate fungicides based on the specific fungal pathogen",
        "Improve air circulation around plants by proper spacing",
        "Water at the base of plants to keep foliage dry",
        "Remove and destroy infected plant material",
        "Use disease-resistant varieties in future plantings"
    ],
    "Healthy": [
        "Continue regular monitoring for early signs of disease",
        "Maintain proper watering schedule",
        "Apply balanced fertilization",
        "Practice crop rotation",
        "Implement preventative measures during high-risk periods"
    ],
    "Cant Classified": [
        "Take clearer images of the affected area",
        "Consult with a local agricultural extension service",
        "Monitor the plant for developing symptoms",
        "Check for non-disease stressors like nutrient deficiencies",
        "Consider submitting a physical sample for laboratory analysis"
    ]
}

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model failed to load"}), 500

    try:
        # ✅ Authenticate Firebase user
        decoded_user = verify_token(request)
        uid = decoded_user['uid']
        email = decoded_user.get('email', 'Unknown')
        logger.info(f"🔐 Authorized user: {email} ({uid})")

        # 📷 Get the uploaded image
        file = request.files.get('file')
        if file is None:
            return jsonify({"error": "No file uploaded"}), 400

        image = Image.open(io.BytesIO(file.read())).resize((224, 224))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)

        # 🧠 Fallback logic using "Cant Classified" (Lettuce) class
        MIN_CONFIDENCE = 0.50
        LETTUCE_CLASS_INDEX = CLASS_LABELS.index("Cant Classified")

        predicted_index = np.argmax(predictions[0])
        predicted_label = CLASS_LABELS[predicted_index]
        confidence = float(predictions[0][predicted_index])
        lettuce_confidence = float(predictions[0][LETTUCE_CLASS_INDEX])

        fallback_used = False
        if confidence < MIN_CONFIDENCE and lettuce_confidence > 0.25:
            predicted_label = "Cant Classified"
            confidence = lettuce_confidence
            fallback_used = True
            logger.info("⚠️ Fallback to 'Cant Classified' due to low confidence")

        class_probabilities = {
            CLASS_LABELS[i]: float(predictions[0][i]) for i in range(len(CLASS_LABELS))
        }

        return jsonify({
            "status": "success",
            "prediction": predicted_label,
            "confidence": round(confidence, 4),
            "class_probabilities": class_probabilities,
            "recommendations": RECOMMENDATIONS[predicted_label],
            "fallback_used": fallback_used  # 🟡 Optional, for frontend awareness
        })

    except Exception as e:
        logger.error(f"❌ Prediction error: {str(e)}")
        return jsonify({"status": "error", "error": str(e)}), 500


# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        "model_name": "LettuceModelV2",
        "input_shape": [224, 224, 3],
        "classes": CLASS_LABELS,
        "version": "1.0.0"
    })
def verify_token(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise ValueError("Missing or malformed Authorization header")

    id_token = auth_header.split(" ")[1]
    decoded_token = firebase_auth.verify_id_token(id_token)
    return decoded_token  # includes uid, email, etc.

@app.route('/send-notification', methods=['POST'])
def send_notification():
    try:
        decoded_user = verify_token(request)
        print(f"🔐 Verified sender: {decoded_user.get('email')}")

        data = request.json
        fcm_token = data.get('token')
        title = data.get('title')
        body = data.get('body')

        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=fcm_token,
        )

        response = messaging.send(message)
        return jsonify({'success': True, 'response': response}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    
def send_breach_email(uid, to_email, sensor_name, device_name, value, threshold):
    try:
        # 🔍 Get sender account from Firestore
        doc_ref = db.collection("mail_senders").document(uid)
        doc_data = doc_ref.get().to_dict()

        if not doc_data or 'accounts' not in doc_data or 'defaultEmail' not in doc_data:
            raise ValueError("Sender credentials not configured")

        default_email = doc_data['defaultEmail']
        sender_account = next((acc for acc in doc_data['accounts'] if acc['email'] == default_email), None)

        if not sender_account:
            raise ValueError("Default sender not found")

        sender_email = sender_account['email']
        app_password = sender_account['appPassword']

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        subject = f"⚠️ Breach Alert: {sensor_name} on Your Device"
        body = f"""
        Hello,

        A sensor on your device has exceeded the set threshold.

        🧪 Sensor: {sensor_name}
        📈 Current Value: {value}
        🚫 Threshold: {threshold}
        📟 Device: {device_name}
        🕒 Time: {timestamp}

        Please take immediate action to address this issue!
        Check your Eco-Mist dashboard for more details.

        Regards,  
        Eco-Mist Monitoring System
        """

        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, to_email, msg.as_string())

        logger.info(f"📧 Breach email sent to {to_email} from {sender_email}")

    except Exception as e:
        logger.error(f"❌ Failed to send breach email: {e}")
        raise
    
@app.route('/breach-email', methods=['POST'])
def breach_email():
    try:
        decoded_user = verify_token(request)
        email = decoded_user.get("email")
        uid = decoded_user.get("uid")

        data = request.json
        device_id = data.get("device_id")
        device_name = data.get("device_name")
        sensor_name = data.get("sensor_name")
        value = data.get("value")
        threshold = data.get("threshold")

        if not all([email, device_name, sensor_name, value, threshold]):
            return jsonify({"error": "Missing required fields"}), 400

        send_breach_email(uid, email, sensor_name, device_name, value, threshold)
        return jsonify({"success": True}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/send-reply', methods=['POST'])
def send_reply():
    try:
        # 🔐 Verify Admin
        decoded_user = verify_token(request)
        uid = decoded_user["uid"]

        # 📤 Email fields
        to_email = request.form.get('to')
        subject = request.form.get('subject')
        body = request.form.get('body')
        file = request.files.get('file')

        # 🔍 Get sender credentials from Firestore
        doc_ref = db.collection("mail_senders").document(uid)
        doc_data = doc_ref.get().to_dict()

        if not doc_data or 'accounts' not in doc_data or 'defaultEmail' not in doc_data:
            return jsonify({'error': 'No sender credentials configured'}), 400

        default_email = doc_data['defaultEmail']
        sender_account = next((acc for acc in doc_data['accounts'] if acc['email'] == default_email), None)

        if not sender_account:
            return jsonify({'error': 'Default sender not found'}), 400

        sender_email = sender_account['email']
        app_password = sender_account['appPassword']

        # 📧 Build email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        if file:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(file.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename="{file.filename}"')
            msg.attach(part)

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.send_message(msg)

        logger.info(f"📤 Email sent from {sender_email} to {to_email}")
        return jsonify({'message': 'Email sent successfully'})

    except Exception as e:
        logger.error(f"❌ Email sending failed: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/verify-recaptcha', methods=['POST'])
def verify_recaptcha():
    data = request.get_json()
    token = data.get('token')

    response = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={
            'secret': RECAPTCHA_SECRET_KEY,
            'response': token
        }
    )
    result = response.json()
    return jsonify(result)

# Main entry point
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
#CORS(app, origins=["http://localhost:5173"])  # or your production URL  