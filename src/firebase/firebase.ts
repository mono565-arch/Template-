import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWFjHrpDcCfLhDXsydfq4-GkX7TbF3uOE",
  authDomain: "pizza-saucy-b0b8f.firebaseapp.com",
  projectId: "pizza-saucy-b0b8f",
  storageBucket: "pizza-saucy-b0b8f.firebasestorage.app",
  messagingSenderId: "907135821309",
  appId: "1:907135821309:web:33732aa8b8925991916594",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

export default app;