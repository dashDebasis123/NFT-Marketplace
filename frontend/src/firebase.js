import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


import { getAnalytics } from "firebase/analytics";
import { getToken, getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {

    apiKey: "AIzaSyCk-pOkpE6GLSB9d4nd5QZWOXiwBoJutrw",

    authDomain: "land-registry-ec940.firebaseapp.com",

    projectId: "land-registry-ec940",

    storageBucket: "land-registry-ec940.appspot.com",

    messagingSenderId: "733014587585",

    appId: "1:733014587585:web:48273a4a537cdd4f457c40",

    measurementId: "G-N5CTS8PWJ8"

};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };
// const analytics = getAnalytics(app);
// const messaging = getMessaging(firebaseApp);

// export const getOrRegisterServiceWorker = () => {
//     if ('serviceWorker' in navigator) {
//         return window.navigator.serviceWorker
//             .getRegistration('/firebase-push-notification-scope')
//             .then((serviceWorker) => {
//                 if (serviceWorker) return serviceWorker;
//                 return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
//                     scope: '/firebase-push-notification-scope',
//                 });
//             });
//     }
//     throw new Error('The browser doesn`t support service worker.');
// };

// export const getFirebaseToken = () =>
//     getOrRegisterServiceWorker()
//         .then((serviceWorkerRegistration) =>
//             getToken(messaging, { vapidKey: "BHUkFjaaIKoU8ay97sD0t76mQDcpfoPFnSyedzGJQ-jk4uL-azsPgEBYKKiTc49EfB3_gn7o0Pqh8F3vGRtBz8g ", serviceWorkerRegistration }));

// export const onForegroundMessage = () =>
//     new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));