import React from 'react'

import './App.css';
import Login2 from './components/Login2';
import MainApp from './components/MainApp'
import {auth} from './firebase'
import {useAuthState} from 'react-firebase-hooks/auth'


function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App color2">
      { user ? <MainApp /> : <Login2 /> }
    </div>
  );
}

export default App;
