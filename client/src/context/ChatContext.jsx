import { createContext, useState, useEffect } from 'react';
import { socket } from '../socket/socket';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('General');

  useEffect(() => {
    socket.connect();

    // Global message
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      // Browser notification
      if (!msg.system && Notification.permission === 'granted' && msg.sender !== user?.username) {
        new Notification(msg.sender, { body: msg.message });
      }
    });

    // Private message
    socket.on('private_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      if (Notification.permission === 'granted') new Notification(msg.sender, { body: msg.message });
    });

    // Typing
    socket.on('typing_users', (users) => setTypingUsers(users));

    // Online users
    socket.on('user_list', setOnlineUsers);

    // System messages
    socket.on('user_joined', (u) => {
      setMessages(prev => [...prev, { id: Date.now(), system: true, message: `${u.username} joined`, timestamp: new Date().toISOString() }]);
    });
    socket.on('user_left', (u) => {
      setMessages(prev => [...prev, { id: Date.now(), system: true, message: `${u.username} left`, timestamp: new Date().toISOString() }]);
    });

    return () => socket.disconnect();
  }, [user]);

  // Connect user
  const connectUser = (username) => {
    setUser({ username });
    socket.emit('user_join', username);
    // request notification permission
    if (Notification.permission !== 'granted') Notification.requestPermission();
  };

  const sendMessage = (message) => {
    socket.emit('send_message', { message, room: currentRoom });
  };

  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  const joinRoom = (room) => {
    setCurrentRoom(room);
    socket.emit('join_room', room);
    setMessages([]); // clear messages when switching room
  };

  const reactToMessage = (messageId, reaction) => {
    socket.emit('message_reaction', { messageId, reaction });
  };

  return (
    <ChatContext.Provider value={{
      user,
      connectUser,
      messages,
      sendMessage,
      onlineUsers,
      typingUsers,
      setTyping,
      sendPrivateMessage,
      currentRoom,
      joinRoom,
      reactToMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
