from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import logging
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

cred = credentials.Certificate("firebase-admin-sdk.json")  # your actual file
firebase_admin.initialize_app(cred)

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

# Prediction route
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

        # Get the uploaded image
        file = request.files.get('file')
        if file is None:
            return jsonify({"error": "No file uploaded"}), 400

        image = Image.open(io.BytesIO(file.read())).resize((224, 224))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions[0])
        predicted_label = CLASS_LABELS[predicted_index]
        confidence = float(predictions[0][predicted_index])
        class_probabilities = {
            CLASS_LABELS[i]: float(predictions[0][i]) for i in range(len(CLASS_LABELS))
        }

        return jsonify({
            "status": "success",
            "prediction": predicted_label,
            "confidence": round(confidence, 4),
            "class_probabilities": class_probabilities,
            "recommendations": RECOMMENDATIONS[predicted_label]
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

# Main entry point
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
