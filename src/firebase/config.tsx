import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdcVCUuMP0qNkG5V7GOLyT5tbZG3ECm9M",
  authDomain: "image-app-84abf.firebaseapp.com",
  projectId: "image-app-84abf",
  storageBucket: "image-app-84abf.appspot.com",
  messagingSenderId: "1065380824901",
  appId: "1:1065380824901:web:7032e9d4ad792545dbe02c",
  measurementId: "G-QXZ2JXELHJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const storage = getStorage(app);
const db = getFirestore(app);
export { auth, storage, db };
