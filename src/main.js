import { createApp } from 'vue'
import router from "./router";
import './style.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import App from './App.vue'

const auth = getAuth();

let app;
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).mount("#app");
  }
});

// ✅ Ensure Dark Mode is applied when app loads
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}


//google authinticator/nodemailer