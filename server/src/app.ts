import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "config";
import cors from 'cors';
import logger from './utils/logger';
import { version } from "../package.json";
import socket from "./socket";

//
//from config folder
const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express()
const httpServer = createServer(app)
//from socket.io
const io = new Server(httpServer,{  
        cors:{
            origin:corsOrigin,
            credentials:true,
        },

});
//express request (req,res)
app.get('/',(_,res)=>res.send(`Server is up and running version ${version}`))

//server listening with server version
httpServer.listen(port,host,()=>{
    logger.info(`Server version ${version} is listening...`);
    logger.info(`http://${host}:${port}`);
    socket({io});
})