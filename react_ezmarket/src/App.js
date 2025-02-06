//import './App.css';
import React from 'react';

import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Home from './components/home';
import GoogleLoginButton from './components/GoogleLoginButton';

import CartList from './components/CartList';
import HeaderComponent from './components/HeaderComponent';
import ItemDetail from './components/ItemDetail';
import Login from './pages/member/login/login.js';
import JoinN from './pages/member/join/joinN';
import Join from './pages/member/join/join';
import Main from './pages/member/main';
import MyPage from './pages/member/my/myPage.js';
import BrandPage from './components/BrandPage.js';
import SearchResultComponent from './components/SearchResultComponent.js';
import FindId from './pages/member/login/findId.js';
import FindPw from './pages/member/login/findPw.js';
import ResetPw from './pages/member/login/resetPw.js';
import Modify from './pages/member/my/modify.js';



function App() {

  return (

    <div>
      <BrowserRouter>
      <HeaderComponent/>
      
      <Routes> 
        <Route path='/cart' element={<CartList/>}/>
        <Route path='/item/:itemid' element={<ItemDetail/>}/>

        <Route path='/brand/:id' element={<BrandPage/>}/>
        <Route path='/search' element={<SearchResultComponent/>}/>

        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/joinN" element={<JoinN />} />
        <Route path="/login/findId" element={<FindId />} />
        <Route path="/login/findPw" element={<FindPw />} />
        <Route path="/login/findPw/resetPw" element={<ResetPw />} />
        <Route path="/my/modify" element={<Modify />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/" element={<Main />} />
        
         <Route path="/home" element={<Home />} />
        <Route path="/loginn" element={<GoogleLoginButton />} />
      </Routes>
      
      </BrowserRouter>
    </div>

  );
}

export default App;
