import { initializeApp } from "firebase/app"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAuth,
  sendSignInLinkToEmail ,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail
} from "firebase/auth"
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAf2f0loUTxnN61Yrs6BGaQoljVVkm68cs",
    authDomain: "hustle-292f2.firebaseapp.com",
    projectId: "hustle-292f2",
    storageBucket: "hustle-292f2.appspot.com",
    messagingSenderId: "894454234209",
    appId: "1:894454234209:web:3e46fef21878c13e0fbe20",
    measurementId: "G-2H1BL2H0JL"
}

const firebaseConfigMain = {
  apiKey: "AIzaSyC_ZdkTNNpMrj39P_y8mQR2s_15TXP1XFk",
  authDomain: "vender-344408.firebaseapp.com",
  projectId: "vender-344408",
  storageBucket: "vender-344408.appspot.com",
  messagingSenderId: "971638842606",
  appId: "1:971638842606:web:edb4a3c8c0bc94f2567fff",
  measurementId: "G-V3M0Y0WSQ1"
};

const app = initializeApp(firebaseConfigMain)
const storage = getStorage(app)
const auth = getAuth(app)
auth.languageCode = 'pt';
const provider = new GoogleAuthProvider();
provider.addScope('email')
const providerFacebook = new FacebookAuthProvider();

const actionCodeSettings = {
  url: "http://localhost:3000",
  // This must be true.
  handleCodeInApp: true
};

const registerWithEmailAndPassword = async (email, password) => {
  var result = await createUserWithEmailAndPassword(auth, email, password)
  return result
}

const loginWithEmailAndPassword = async (email, password) => {
  var result = await signInWithEmailAndPassword(auth, email, password)
  return result
}

const sendSignInLinkToEmailHandler = (email) => {
  console.log(email);
  sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
    console.log(email);
    window.localStorage.setItem('emailForSignIn', email);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}
  

const logout = () => {
  signOut(auth)
}

const fetchSignInMethodsForEmailHandler = async (email) => {
  return await fetchSignInMethodsForEmail(auth, email)
}

const firebaseApp = firebase.initializeApp(firebaseConfigMain)
firebaseApp.auth()
const RecaptchaVerifier = firebase.auth.RecaptchaVerifier

export {
  app,
  auth,
  provider,
  providerFacebook,
  storage,
  RecaptchaVerifier,
  fetchSignInMethodsForEmailHandler,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  sendSignInLinkToEmailHandler,
  logout,
}