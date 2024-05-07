import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA7u7n9Z-IHJYD9Z56RYO9dE728u1aD0_g",
  authDomain: "whats-app-clone-89af4.firebaseapp.com",
  databaseURL: "https://whats-app-clone-89af4-default-rtdb.firebaseio.com/",
  projectId: "whats-app-clone-89af4",
  storageBucket: "whats-app-clone-89af4.appspot.com",
  messagingSenderId: "1065830625005",
  appId: "1:1065830625005:web:bf96897176a217be3a66e4",
  measurementId: "G-9BVNF12K2Z",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
export default db;
