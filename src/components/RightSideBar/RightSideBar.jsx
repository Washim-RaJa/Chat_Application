import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'

const RightSideBar = () => {
  const {chatUser, messages} = useContext(AppContext);
  const [msgImages, setMsgImage] = useState([]);

  useEffect(()=> {
    let tempVar = [];
    messages.map((msg)=> {
      if (msg.image) {
        tempVar.push(msg.image)
      }
    })
    setMsgImage(tempVar);
    
  }, [messages])

  return chatUser ? (
    <div className='rs'>
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="profile_image" />
        <h3>
          { 
            Date.now() - chatUser.userData.lastSeen <= 70000
            ?  <img className='dot' src={assets.green_dot} alt="green_dot_icon" />
            : null
          }
          {chatUser.userData.name}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, idx)=> (
            <img onClick={()=> window.open(url)} key={idx} src={url} alt="chat-image" />
          ))}
        </div>
      </div>
      <button onClick={()=> logout()}>Log out</button>
    </div>
  ) : (
    <div className='rs'>
      <button onClick={()=> logout()}>Log out</button>
    </div>
  )
}

export default RightSideBar