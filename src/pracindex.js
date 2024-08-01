
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
import {Server} from 'socket.io'
import {createServer} from 'http'
import { connectDB } from './db/index.js'
import { app } from './app.js'

const PORT = process.env.PORT
const HOST = process.env.HOST 
const server = createServer(app)


connectDB()
.then(info => {
    server.listen(PORT,HOST, () => console.log(`Server listening on PORT ${PORT}`) )
   console.log(PORT,HOST)
    // console.log('info', info)
})
.catch(error => {
    console.log(error.message)
})
const io = new Server(server,{
    cors:{
        origin: 'http://localhost:5173',
        methods: ['GET','POST','PATCH','DELETE']
    }
})

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
  
    socket.on("user_message", ({ roomId, message }) => {
      console.log({ roomId, message });
      socket.to(roomId).emit("receive-message", message);
    });
  
    // socket.on("join-room", (room) => {
    //   socket.join(room);
    //   console.log(`User joined room ${room}`);
    // });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
  