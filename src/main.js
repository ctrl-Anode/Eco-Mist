import { createApp } from 'vue'
import router from "./router";
import './style.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { requestFcmToken, onMessageListener } from "./firebase";

import App from './App.vue'

const auth = getAuth();

const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

let app;
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).use(Toast, toastOptions).mount("#app");
  }
});

// ✅ Ensure Dark Mode is applied when app loads
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Request FCM token
if ('serviceWorker' in navigator) {
  requestFcmToken().then((token) => {
    if (token) {
      console.log("FCM Token received: [TOKEN REDACTED]");
      // Optionally send to backend
    }
  });
}


// Handle incoming messages
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).use(Toast, toastOptions).mount("#app");

    // ✅ Now app is defined — safe to use
    onMessageListener().then((payload) => {
      const { title, body } = payload.notification;
      app.$toast.info(`${title}: ${body}`);
    });
  }
});


//google authinticator/nodemailer