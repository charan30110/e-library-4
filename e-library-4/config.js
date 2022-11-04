import * as firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyCozmmmz5gY1Jue_3aP39u2-298JHFGIOc",
  authDomain: "e-library-88cc8.firebaseapp.com",
  databaseURL: "https://e-library-88cc8-default-rtdb.firebaseio.com",
  projectId: "e-library-88cc8",
  storageBucket: "e-library-88cc8.appspot.com",
  messagingSenderId: "146703983709",
  appId: "1:146703983709:web:c716308b177a5c503ad9b4",
  measurementId: "G-2JNXFG2B33"
};

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();