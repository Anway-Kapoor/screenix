import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile 
} from "firebase/auth";
import { auth } from "./firebase";
import { addUser } from "./firestoreService";

export const signUp = async (email, password, displayName) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName
    });

    // Store user data in Firestore
    const userData = {
      uid: userCredential.user.uid,
      email: email,
      displayName: displayName,
      createdAt: new Date().toISOString()
    };

    // Use the existing addUser function to store in Firestore
    await addUser(userData);

    return userCredential.user;
  } catch (error) {
    console.error("Error in signup:", {
      code: error.code,
      message: error.message,
      fullError: error
    });
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
