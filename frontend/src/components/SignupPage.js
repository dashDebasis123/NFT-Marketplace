// src/components/Signup.js
import React, { useState } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");

    const handleSignup = async () => {
        try {
            // Check if the user already exists
            const existingUserQuery = query(collection(db, "users"), where("email", "==", email));
            const existingUserSnapshot = await getDocs(existingUserQuery);

            console.log("Existing user query:", existingUserQuery);
            console.log("Existing user snapshot:", existingUserSnapshot);

            console.log("User signed up:", user);


            if (existingUserSnapshot.size > 0) {
                alert("user already exits {email}")
                console.error("User already exists with this email");
                window.location.reload();
                return;
            }

            // If user doesn't exist, create a new account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user info and address in Firestore
            const userRef = collection(db, "users");
            await addDoc(userRef, {
                uid: user.uid,
                email: user.email,
                address: address,
            });

            console.log("User signed up:", user);
        } catch (error) {
            console.error("Error signing up:", error.message);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;
