import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEjt2ldnxEL5gf98jsKhjg6TPW8vt1-HY",
  authDomain: "chat-app-66059.firebaseapp.com",
  projectId: "chat-app-66059",
  storageBucket: "chat-app-66059.firebasestorage.app",
  messagingSenderId: "843076014528",
  appId: "1:843076014528:web:e8c022e858a50abbde7825",
  measurementId: "G-SPXFP4CKJS",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
