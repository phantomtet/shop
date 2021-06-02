import { useSelector } from 'react-redux';
import './App.css';
import Login from './components/Login'
import MainApp from './components/MainApp'

function App() {
  const a = useSelector(state => state.clientinfo)
  return (
    <div className="App">
      { a === '' ? <Login/> : <MainApp/> }
    </div>
  );
}

export default App;
