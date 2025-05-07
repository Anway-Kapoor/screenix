import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

// Function to add a user
export const addUser = async (userData) => {
  try {
    // Use setDoc with the user's UID as the document ID
    await setDoc(doc(db, "users", userData.uid), userData);
    console.log("User document written with ID: ", userData.uid);
    return userData.uid;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Function to fetch all users
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    let users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (e) {
    console.error("Error fetching users: ", e);
    throw e;
  }
};
