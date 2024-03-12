const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(join(__dirname, "chat.html"));
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

// this will emit the event to all connected sockets
io.emit('hello', 'world');

// let connectedUsers = {};

// io.on("connection", (socket) => {
//   // Generate a unique identifier for this client connection
//   const userId = Math.random().toString(36).substring(2, 15);

//   // Get the username sent by the client during connection (might be unreliable)
//   let username = socket.handshake.query.username || "Anonymous";

//   // Check if username already exists (case-insensitive)
//   const existingUser = Object.values(connectedUsers).find(
//     (user) => user.username.toLowerCase() === username.toLowerCase()
//   );
//   if (existingUser) {
//     // Username conflict, send an error message to the client and ask for a new username
//     socket.emit("username_conflict", {
//       message: "Username already taken, please choose another one.",
//     });
//     // Prompt the client to choose a new username and update it on the server
//     socket.on("new_username", (newUsername) => {
//       username = newUsername;
//       connectedUsers[userId] = { username }; // Update username with the new one
//       socket.emit("username_updated", { username }); // Inform client about the username change
//     });
//   } else {
//     // No username conflict, store the username and identifier
//     connectedUsers[userId] = { username };
//   }

//   // Broadcast a message to all connected clients about a new user joining
//   socket.broadcast.emit("user_joined", { username });

//   // Handle incoming chat messages
//   socket.on("chat message", (msg) => {
//     // Get the username from the connected users map
//     const user = connectedUsers[userId];
//     if (user) {
//       // Broadcast the message to all connected clients with the correct username
//       io.emit("chat message", { username: user.username, message: msg });
//     }
//   });

//   // Handle client disconnection
//   socket.on("disconnect", () => {
//     // Remove the user from the connected users map
//     const user = connectedUsers[userId];
//     if (user) {
//       delete connectedUsers[userId];
//       // Broadcast a message to all connected clients about a user leaving
//       socket.broadcast.emit("user_left", { username: user.username });
//     }
//   });
// });

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
