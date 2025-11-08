import { useState, useContext } from 'react';
import { ChatContext } from '../context/ChatContext.jsx';

export default function ChatInput() {
  const { sendMessage, setTyping } = useContext(ChatContext);
  const [input, setInput] = useState('');

  const handleSend = e => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
    setTyping(false);
  };

  const handleTyping = e => {
    setInput(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  return (
    <form onSubmit={handleSend} className="chat-input">
      <input value={input} onChange={handleTyping} placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  );
}
