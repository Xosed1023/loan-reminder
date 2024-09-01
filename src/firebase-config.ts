import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDEUMERpJRTdKra-7Vs56ijm0sI_pg12sM",
    authDomain: "loan-reminder-fcc20.firebaseapp.com",
    projectId: "loan-reminder-fcc20",
    storageBucket: "loan-reminder-fcc20.appspot.com",
    messagingSenderId: "547321866631",
    appId: "1:547321866631:android:1d9a01bb861fb148fb0b22",
    measurementId: "G-XXXXXXXXXX"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Cloud Messaging
const messaging = getMessaging(app);

const checkPermissions = async () => {
    const result = await FirebaseMessaging.checkPermissions();
    return result.receive;
};

const requestPermissions = async () => {
    const result = await FirebaseMessaging.requestPermissions();
    return result.receive;
};

const onMessageListener = (callback: (payload: any) => void) => {
    FirebaseMessaging.addListener("notificationReceived", callback);
};
const getToken = async () => {
    const result = await FirebaseMessaging.getToken();
    return result.token;
};

export const firebase = {
    checkPermissions,
    onMessageListener,
    getToken,
    requestPermissions
};