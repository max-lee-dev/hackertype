import firebase from "firebase";
  
const firebaseConfig = {
  apiKey: "AIzaSyATKyTSJVN7-Zx60WQ66kkHo3nBhuMhYDs",
  authDomain: "meteor-3fd94.firebaseapp.com",
  projectId: "meteor-3fd94",
  storageBucket: "meteor-3fd94.appspot.com",
  messagingSenderId: "391620415322",
  appId: "1:391620415322:web:6848292646d9e91e6e6d63",
  measurementId: "G-69J20TCH7X",
};
  
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
  
export default db;

