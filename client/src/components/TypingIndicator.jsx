import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.jsx';

export default function TypingIndicator() {
  const { typingUsers, user } = useContext(ChatContext);
  const otherTyping = typingUsers.filter(name => name !== user?.username);

  return <div className="typing">{otherTyping.length > 0 ? `${otherTyping.join(', ')} is typing...` : ''}</div>;
}
