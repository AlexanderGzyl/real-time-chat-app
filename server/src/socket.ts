import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";


//events object
const EVENTS = {
    connection: 'connection',
    CLIENT:
    {CREATE_ROOM:'CREATE_ROOM',
    SEND_ROOM_MESSAGE:'SEND_ROOM_MESSAGE',
    JOIN_ROOM:'JOIN_ROOM',
},
    SERVER:{
        ROOMS:"ROOMS",
        JOINED_ROOM:"JOINED_ROOM",
        ROOM_MESSAGE:"ROOM_MESSAGE",


},
}
//rooms objects
const rooms:Record<string,{name:string}> = {};

function socket({ io }: { io: Server }) {
    logger.info('Sockets enabled')

io.on(EVENTS.connection,(socket:Socket)=>{
    //what is the user id
    logger.info(`user connected ${socket.id}`)
    //display rooms already created
    socket.emit(EVENTS.SERVER.ROOMS,rooms);
    //arguments passed from client Rooms.tsx ie: when I user creates a new room
    socket.on(EVENTS.CLIENT.CREATE_ROOM,({roomName})=>{
    
        //create a room id
        const roomId = nanoid()
        //add a new room to roooms object
        rooms[roomId] ={
            name:roomName,
        }
        console.log(rooms)
        socket.join(roomId);

        //boradcast event saying that there is a new room
        socket.broadcast.emit(EVENTS.SERVER.ROOMS,rooms)
        //emit back to the room creator with all the rooms
        socket.emit(EVENTS.SERVER.ROOMS,rooms)
        // emit event back to the room creator saying that they joined
        socket.emit(EVENTS.SERVER.JOINED_ROOM,roomId)
        
    });
    //arguments passed from client messages.tsx ie: when a user sends message
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE,({roomId,message,username})=>{
        const date = new Date();

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
            message,
            username,
            time:`${date.getHours()}:${date.getMinutes()}`,
        });
    });

    //when a user joins a room
    socket.on(EVENTS.CLIENT.JOIN_ROOM,(roomId)=>{
        socket.join(roomId)
        socket.emit(EVENTS.SERVER.JOINED_ROOM,roomId)
    })
})
}

export default socket