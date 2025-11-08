import { useState, useContext } from 'react';
import { ChatContext } from './context/ChatContext.jsx';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const { user } = useContext(ChatContext);

  return (
    <>
      {!loggedIn || !user ? <Login onLogin={() => setLoggedIn(true)} /> : <Chat />}
    </>
  );
}

export default App;
