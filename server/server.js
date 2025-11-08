// server.js - Socket.io Chat Server with rooms, private messages, and reactions

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {}; // { socketId: { username, currentRoom } }
const rooms = { General: [], Tech: [], Random: [] }; // Room-wise message storage
const typingUsers = {}; // { socketId: username }

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, currentRoom: 'General' };
    socket.join('General'); // default room
    io.to('General').emit('user_list', getUsersInRoom('General'));
    io.to('General').emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Join a room
  socket.on('join_room', (room) => {
    const user = users[socket.id];
    if (!user) return;
    socket.leave(user.currentRoom); // leave previous room
    socket.join(room);
    user.currentRoom = room;

    // Send system messages
    io.to(room).emit('system_message', `${user.username} joined ${room}`);
    socket.emit('receive_message', rooms[room] || []);
  });

  // Send a message
  socket.on('send_message', ({ message, room }) => {
    const user = users[socket.id];
    if (!user) return;
    const targetRoom = room || user.currentRoom;

    const messageData = {
      id: Date.now(),
      sender: user.username,
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      room: targetRoom,
      reactions: [], // For future reaction updates
    };

    // Save message
    if (!rooms[targetRoom]) rooms[targetRoom] = [];
    rooms[targetRoom].push(messageData);
    if (rooms[targetRoom].length > 100) rooms[targetRoom].shift(); // limit messages

    io.to(targetRoom).emit('receive_message', messageData);
  });

  // Typing indicator
  socket.on('typing', (isTyping) => {
    const user = users[socket.id];
    if (!user) return;
    const room = user.currentRoom;
    if (isTyping) {
      typingUsers[socket.id] = user.username;
    } else {
      delete typingUsers[socket.id];
    }
    io.to(room).emit('typing_users', Object.values(typingUsers));
  });

  // Private message
  socket.on('private_message', ({ to, message }) => {
    const user = users[socket.id];
    if (!user) return;
    const messageData = {
      id: Date.now(),
      sender: user.username,
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Message reactions
  socket.on('message_reaction', ({ messageId, reaction, room }) => {
    const targetRoom = room || users[socket.id]?.currentRoom;
    if (!rooms[targetRoom]) return;

    const msg = rooms[targetRoom].find(m => m.id === messageId);
    if (msg) {
      msg.reactions.push(reaction);
      io.to(targetRoom).emit('update_reactions', { messageId, reactions: msg.reactions });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.currentRoom).emit('user_left', { username: user.username, id: socket.id });
      console.log(`${user.username} left the chat`);
    }

    delete users[socket.id];
    delete typingUsers[socket.id];

    // Update all rooms' online users
    Object.keys(rooms).forEach(room => {
      io.to(room).emit('user_list', getUsersInRoom(room));
    });
  });
});

// Helper function to get users in a specific room
function getUsersInRoom(room) {
  return Object.values(users).filter(u => u.currentRoom === room).map(u => ({ username: u.username }));
}

// API routes
app.get('/api/messages/:room', (req, res) => {
  const { room } = req.params;
  res.json(rooms[room] || []);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
