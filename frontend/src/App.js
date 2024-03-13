import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TweetDetail from './pages/TweetDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/login' element={<Login />}></Route>
          <Route exact path='/signup' element={<SignUp />}></Route>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/profile/:id' element={<Profile />}></Route>
          <Route exact path='/tweet/:id' element={< TweetDetail />}></Route>


        </Routes>
      </Router>
    </div>
  );
}

export default App;
