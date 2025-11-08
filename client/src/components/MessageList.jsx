import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.jsx';

export default function MessageList() {
  const { messages, reactToMessage } = useContext(ChatContext);

  return (
    <div className="messages">
      {messages.map(msg => (
        <div key={msg.id} className={msg.system ? 'system-msg' : 'user-msg'}>
          {msg.system ? msg.message : `${msg.sender}: ${msg.message}`}
          {!msg.system && (
            <span className="reactions">
              <button onClick={() => reactToMessage(msg.id, '❤️')}>❤️</button>
              <button onClick={() => reactToMessage(msg.id, '👍')}>👍</button>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
