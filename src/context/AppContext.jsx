import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props)=> {
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null)
    const [messages, setMessages] = useState([])
    const [chatUser, setChatUser] = useState(null)
    const [chatVisible, setChatVisible] = useState(false)

    // Fetching User's data and chats from firebase using uid
    const loadUserData = async (uid)=>{
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userCredentials = userSnap.data()
            setUserData(userCredentials);

            if (userCredentials.avatar && userCredentials.name) {
                navigate('/chat')
            } else{
                navigate('/profile')
            }
            
            await updateDoc(userRef, { lastSeen: Date.now()});
            
            
            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, { lastSeen: Date.now()});
                    console.log(auth.chatUser);
                }
            }, 60000);
            // console.log(auth);
            // console.log(auth.chatUser);
        } catch (error) {
            console.error(error);
        }
    }
    // Fetching User's chats from firebase using uid
    useEffect(()=> {
        if(userData){
            const chatRef = doc(db, "chats", userData.id);
            // To get the real-time update of the document
            const unSub = onSnapshot(chatRef, async (res)=> {

                const chatItems = res.data().chatsData;
                // console.log(res.data());
                
                const tempData = [];
                for(const item of chatItems){
                    // whenever we create the chatData we'll create the rId which displays the receiver's id
                    const userRef = doc(db, "users", item.rId)
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({...item, userData})
                }
                setChatData(tempData.sort((a,b)=> b.updatedAt - a.updatedAt))   // To keep the recent chat at top & old chat at bottom

                return ()=> {
                    unSub();
                }
            })
        }
    }, [userData])
    
    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        messagesId, setMessagesId,
        messages, setMessages,
        chatUser, setChatUser,
        chatVisible, setChatVisible
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;