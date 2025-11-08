Real-Time Chat Application with Socket.io
Project Overview

This project is a real-time chat application built with Node.js, Express, Socket.io, and React.
It supports:

Global chat and multiple rooms (channels)

Private messaging between users

Typing indicators

Online/offline status

Message reactions (like ❤️, 👍)

Browser notifications and sound notifications

Responsive design for desktop and mobile

Folder Structure
chat-app/
 ┣ server/
 ┃ ┣ server.js                 # Main backend server
 ┃ ┣ package.json
 ┃ ┗ .env                      # Environment variables (CLIENT_URL, PORT)
 ┣ client/
 ┃ ┣ src/
 ┃ ┃ ┣ components/
 ┃ ┃ ┣ context/
 ┃ ┃ ┣ pages/
 ┃ ┃ ┣ socket/
 ┃ ┃ ┣ styles/
 ┃ ┃ ┗ App.jsx
 ┃ ┣ package.json
 ┃ ┗ vite.config.js
 ┗ README.md

Setup Instructions
1. Clone the repository
git clone <your-repo-url>
cd chat-app

2. Backend Setup
cd server
npm install


Create a .env file:

PORT=5000
CLIENT_URL=http://localhost:5173


Run the backend server:

npm run dev


The backend will run on http://localhost:5000.

3. Frontend Setup
cd ../client
npm install


Create a .env file (optional):

VITE_SOCKET_URL=http://localhost:5000


Run the frontend:

npm run dev


The frontend will run on http://localhost:5173 (Vite default).

4. Features / Usage
Login

Enter a username to join the chat.

Username-based authentication (no passwords required).

Global Chat

Messages are displayed with sender name and timestamp.

Typing indicator shows when someone is typing.

Multiple Rooms

Users can switch between General, Tech, and Random rooms.

Messages are stored per room.

Room changes emit system notifications.

Private Messaging

Click a username (or use frontend private message feature) to send private messages.

Only the sender and receiver can see private messages.

Message Reactions

React to messages with ❤️ or 👍.

Reactions are broadcast in real-time to all users in the room.

Notifications

Browser notifications appear for new messages.

System messages show when users join/leave.

Sound notifications play for new messages (optional: add notification.mp3 in public/ folder).

Typing & Online Status

Typing indicator visible per room.

Online users list updates in real-time.

5. Socket.io Events
Event	Direction	Description
user_join	Client → Server	Join the chat with a username
send_message	Client → Server	Send message to a room
receive_message	Server → Client	Broadcast messages in room
join_room	Client → Server	Switch room
private_message	Both	Send private messages
typing	Client → Server	Show typing indicator
user_list	Server → Client	List online users
user_joined	Server → Client	Notify when user joins
user_left	Server → Client	Notify when user leaves
message_reaction	Both	React to a message
update_reactions	Server → Client	Broadcast updated reactions
system_message	Server → Client	Show system messages (join/leave room)
6. Performance & Optimization

Messages limited to last 100 per room.

Socket.io reconnection enabled.

Room-based typing and online status for efficiency.