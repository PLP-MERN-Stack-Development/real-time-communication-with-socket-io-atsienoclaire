import { useState, useContext } from 'react';
import { ChatContext } from '../context/ChatContext.jsx';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const { connectUser } = useContext(ChatContext);

  const handleLogin = e => {
    e.preventDefault();
    if (!username.trim()) return;
    connectUser(username.trim());
    onLogin();
  };

  return (
    <div className="login-page">
      <h2>Join Chat</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
        <button type="submit">Join</button>
      </form>
    </div>
  );
}
