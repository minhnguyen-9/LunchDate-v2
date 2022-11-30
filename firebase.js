// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQAQo8ulC23StQhLIDQWRuMYg8dQhz4bc",
  authDomain: "lunchdate-v1.firebaseapp.com",
  projectId: "lunchdate-v1",
  storageBucket: "lunchdate-v1.appspot.com",
  messagingSenderId: "1061893431445",
  appId: "1:1061893431445:web:fb1aab8ffa3d9127453b9c",
  measurementId: "G-PSZ92RB75Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

export{auth,db};