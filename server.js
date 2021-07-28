const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages.js");
const { userJoin, getCurrentUser, userLeave } = require("./utils/users.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const hostname = "localhost";
const botName = "DevCircle Bot";

//set static folder(bringing html and css)
app.use(express.static(path.join("public")));

//run when user connect
io.on("connection", (socket) => {
   console.log("New user zzz connection");
   socket.on("joinRoom", ({ username }) => {
      const user = userJoin(socket.id, username);

      //welcome current user
      socket.emit(
         "message",
         formatMessage(botName, "Welcome to devcircle chat platform")
      );

      //broadcast when a user connects(emits to everyone except the user) but if you want to broadcast to broadcast to everyone, yourself inclusive, you use io.emit.
      // socket.on('connects',()=>{
      //    socket.broadcast.emit('message', 'A user has join the chat');
      // })

      socket.broadcast.emit(
         "message",
         formatMessage(botName, `${user.username} has join the chat`)
      );
   });


   //listen for chat message
   socket.on("chatMessage", msg => {
      console.log(msg);
      const user = getCurrentUser(socket.id);
      io.emit("message", formatMessage(user.username, msg));
   });


   //runs when client disconnects
   socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
         io.emit("message", formatMessage(botName, `${user.username} has left the chat`));
      }
   });
});

server.listen(port, hostname, () => {
   console.log(`Server is listening at https://${hostname}:${port}`);
});
