// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCk-pOkpE6GLSB9d4nd5QZWOXiwBoJutrw",

    authDomain: "land-registry-ec940.firebaseapp.com",

    databaseURL:
        "https://land-registry-ec940-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "land-registry-ec940",

    storageBucket: "land-registry-ec940.appspot.com",

    messagingSenderId: "733014587585",

    appId: "1:733014587585:web:48273a4a537cdd4f457c40",

    measurementId: "G-N5CTS8PWJ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
