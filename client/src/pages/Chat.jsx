import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import MessageList from '../components/MessageList.jsx';
import ChatInput from '../components/ChatInput.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';

export default function Chat() {
  const { currentRoom } = useContext(ChatContext);

  return (
    <div className="chat-container">
      <Sidebar />
      <div className="chat-main">
        <h3>Room: {currentRoom}</h3>
        <MessageList />
        <TypingIndicator />
        <ChatInput />
      </div>
    </div>
  );
}
