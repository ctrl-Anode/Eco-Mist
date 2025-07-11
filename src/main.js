import { createApp } from 'vue'
import router from "./router";
import './style.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { requestFcmToken, onMessageListener } from "./firebase";

import { VueReCaptcha } from 'vue-recaptcha-v3'

const SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

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
    app = createApp(App)
      .use(router)
      .use(Toast, toastOptions)
      .use(VueReCaptcha, { siteKey: SITE_KEY })
      .mount("#app");

      router.afterEach((to) => {
  setTimeout(() => {
    const badge = document.querySelector(".grecaptcha-badge");
    if (!badge) return;

    const visibleRoutes = ["/auth"];
    if (visibleRoutes.includes(to.path)) {
      badge.style.display = "block";
    } else {
      badge.style.display = "none";
    }
  }, 1000);
});

    // ✅ Handle incoming FCM messages
    onMessageListener().then((payload) => {
      const { title, body } = payload.notification;
      app.config.globalProperties.$toast.info(`${title}: ${body}`);
    });
  }
});

// ✅ Apply dark mode on load
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// ✅ Request FCM token
if ('serviceWorker' in navigator) {
  requestFcmToken().then((token) => {
    if (token) {
      console.log("FCM Token received: [TOKEN REDACTED]");
      // Optionally send to backend
    }
  });
}

//google authinticator/nodemailer