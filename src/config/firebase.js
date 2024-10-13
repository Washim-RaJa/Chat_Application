import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Creating Sign up method
const signup = async (username, email, passowrd) => {
    try {
        // Creating a user by firebase's method with email and password
        const res = await createUserWithEmailAndPassword(auth, email, passowrd);
        const user = res.user;
        // Now storing the data in users collection in firebase database
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, There I am using ChatApp",
            lastSeen: Date.now()
        })
        toast.success("Sign up successful!")
        // Now storing the data in chats collection in firebase database
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: []
        })
        // On creating a new account everytime, the above two collections(users & chats) will be created
    } catch (error) {
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}
// Creating Log in method
const login = async (email, passowrd) => {
    try {
        await signInWithEmailAndPassword(auth, email, passowrd);
        toast.success("Log in successful!")
    } catch (error) {
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}
// Creating Log out method
const logout = async () => {
    try {
        await signOut(auth);
        toast.success("Log out successful!")
    } catch (error) {
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}
const resetPass = async (email)=> {
    if (!email) {
        toast.error("Please enter your email")
        return null;
    }
    try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", email))
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email)
            toast.success("Email reset succesful")
        }
        else{
            toast.error("Email doesn't exist")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
}

export { signup, login, logout, auth, db, resetPass }