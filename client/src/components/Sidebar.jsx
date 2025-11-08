import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext.jsx';

export default function Sidebar() {
  const { onlineUsers, joinRoom } = useContext(ChatContext);
  const rooms = ['General', 'Tech', 'Random'];

  return (
    <div className="sidebar">
      <h3>Rooms</h3>
      <ul>
        {rooms.map((r) => (
          <li key={r} onClick={() => joinRoom(r)}>{r}</li>
        ))}
      </ul>
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map(u => <li key={u.id}>{u.username}</li>)}
      </ul>
    </div>
  );
}
