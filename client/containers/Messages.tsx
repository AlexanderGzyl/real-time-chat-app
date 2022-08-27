import { useSockets } from "../context/socket.context";
import {useEffect, useRef} from 'react';
import EVENTS from "../config/events";
import styles from "../styles/Messages.module.css"

function MessagesContainer(){
    const {socket, messages,roomId,username,setMessages} = useSockets()
    const newMessageRef= useRef(null)
    const messageEndRef =useRef(null)
    function handleSendMessage(){
        const message = newMessageRef.current.value;
        if(!String(message).trim()){
            return;
        }
        // when we create a ne wmessage we need to broadcast it to everyone else
        socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE,{roomId,message,username})
        //emit a new event to client with message id or manual set messages
        //manually set message
        //message object needs to mathc the broadcast
        const date = new Date()
        setMessages([
            ...messages,{
                username:'You',
                message,
                time:`${date.getHours()}:${date.getMinutes()}`,
            },
        ])

        newMessageRef.current.value = '';
    }

    useEffect(()=>{
        messageEndRef.current?.scrollIntoView({behaviour:"smooth"})
    },[messages])
    if(!roomId){
        return <div></div>
    }
//need to add unique id
    return (
    <div className= {styles.wrapper}>
            <div className= {styles.messageList}>
                {messages.map(({message,username,time}, index)=>{
                return <div className={styles.message} key = {index}>
                            <div className={styles.messageInner}>
                                <span className={styles.messageSender}>{username} - {time}</span>
                                <span className={styles.messageBody}>{message}</span>
                            </div>
                    </div>
                })}
            </div>
            <div ref ={messageEndRef}/>
        <div className={styles.messageBox}>
            <textarea
            rows={1}
            placeholder="Tell us what you are thinking"
            ref={newMessageRef}
            />
            <button onClick={handleSendMessage}>SEND</button>
            
        </div>

    </div>
)}

export default MessagesContainer;