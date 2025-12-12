import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithCredential,
  PhoneAuthProvider
} from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf1eUmEyoEGSdug4Lca2nVu2cho2HJTEA",
  authDomain: "booking-project-5eceb.firebaseapp.com",
  projectId: "booking-project-5eceb",
  storageBucket: "booking-project-5eceb.firebasestorage.app",
  messagingSenderId: "735950157548",
  appId: "1:735950157548:web:4b358e9ef5592c4e9117c9",
  measurementId: "G-HDVS8WXDJX"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log(auth, "bj");
console.log(app);


// Setup reCAPTCHA verifier for phone authentication
const setupRecaptcha = (containerId = "recaptcha-container") => {

  clearRecaptcha();

  const recaptchaVerifier = new RecaptchaVerifier(
    auth,
    containerId,
    {
      size: 'invisible', // or 'normal' for visible widget
      callback: () => {
        // This will be called when reCAPTCHA is solved
        console.log('reCAPTCHA solved');
      }
    }
  );

  return recaptchaVerifier;
};

// Clear reCAPTCHA
const clearRecaptcha = () => {
  const container = document.getElementById("recaptcha-container");
  if (container) {
    container.innerHTML = '';
  }
};

// Verify SMS code
const verifySMSCode = async (confirmationResult, code) => {
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Sign out
const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Get current user
const getCurrentUser = () => {
  return auth.currentUser;
};

export {
  auth,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  setupRecaptcha,
  clearRecaptcha,
  verifySMSCode,
  signOutUser,
  getCurrentUser
};


console.log(app);
