import {useSockets} from '../context/socket.context';
import {useRef} from 'react'
import EVENTS from '../config/events';
import styles from '../styles/Room.module.css'

function RoomsContainer(){

    const {socket,roomId, rooms} = useSockets();
    const newRoomRef = useRef(null);

    //handles
    function handleCreateRoom(){
        // get room name
        const roomName = newRoomRef.current.value || ''
        if(!String(roomName).trim()) return;
        
        //emit a new room has been created
        //name of emit event and arguments you want passed to server
        socket.emit(EVENTS.CLIENT.CREATE_ROOM,{roomName});
        //set room name input to empty string
        newRoomRef.current.value ='';
    }
    function handleJoinRoom(key){
        //clicks on own room do nothing
        if (key === roomId) return

        socket.emit(EVENTS.CLIENT.JOIN_ROOM,key)

    }
    return (
    <nav className={styles.wrapper}>
        <div className = {styles.createRoomWrapper}>
            <input placeholder='Room Name' ref ={newRoomRef}/>
            <button className = 'btn-primary'onClick={handleCreateRoom}>CREATE ROOM</button>
        </div>

        {/* map through rooms to get roomId */}
        <ul className={styles.roomList}>
        {Object.keys(rooms).map((key)=>{
            return <div key={key}>
                    <button disabled={key===roomId}
                            title={`Join ${rooms[key].name}`}
                            onClick={()=>handleJoinRoom(key)}
                            >
                            {rooms[key].name}
                    </button>
                </div>
        })}
        </ul>
    </nav>
)}

export default RoomsContainer;