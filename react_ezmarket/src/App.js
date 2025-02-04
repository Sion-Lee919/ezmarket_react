//import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/member/login/login.js';
import JoinN from './pages/member/join/joinN';
import Join from './pages/member/join/join';
import Main from './pages/member/main';
import MyPage from './pages/member/my/myPage.js';


function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/joinN" element={<JoinN />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/" element={<Main />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
