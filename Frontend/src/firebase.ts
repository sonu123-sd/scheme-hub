import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBg9JtEEVMQEG_4LdFoVFRgRaxQb9D-0J8",
  authDomain: "schemehub-1b33e.firebaseapp.com",
  projectId: "schemehub-1b33e",
  storageBucket: "schemehub-1b33e.firebasestorage.app",
  messagingSenderId: "792335720760",
  appId: "1:792335720760:web:f13878298e1d4c5870e1cd",
  measurementId: "G-2ZCZ1XDXKP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
