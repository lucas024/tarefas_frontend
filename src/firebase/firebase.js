import { initializeApp } from "firebase/app"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  updatePhoneNumber,
  fetchSignInMethodsForEmail
} from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyAf2f0loUTxnN61Yrs6BGaQoljVVkm68cs",
    authDomain: "hustle-292f2.firebaseapp.com",
    projectId: "hustle-292f2",
    storageBucket: "hustle-292f2.appspot.com",
    messagingSenderId: "894454234209",
    appId: "1:894454234209:web:3e46fef21878c13e0fbe20",
    measurementId: "G-2H1BL2H0JL"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
auth.languageCode = 'pt';
const provider = new GoogleAuthProvider();

const registerWithEmailAndPassword = async (email, password) => {
  var result = await createUserWithEmailAndPassword(auth, email, password)
  return result
}

const loginWithEmailAndPassword = async (email, password) => {
  var result = await signInWithEmailAndPassword(auth, email, password)
  return result
}

const logout = () => {
  signOut(auth)
}

const fetchSignInMethodsForEmailHandler = async (email) => {
  return await fetchSignInMethodsForEmail(auth, email)
}



export {
  auth,
  provider,
  fetchSignInMethodsForEmailHandler,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
}