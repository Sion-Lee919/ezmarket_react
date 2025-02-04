//import './App.css';
import React from 'react';

import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartList from './components/CartList';
import HeaderComponent from './components/HeaderComponent';
import ItemDetail from './components/ItemDetail';
import Login from './pages/member/login/login.js';
import JoinN from './pages/member/join/joinN';
import Join from './pages/member/join/join';
import Main from './pages/member/main';
import MyPage from './pages/member/my/myPage.js';
import BrandPage from './components/BrandPage.js';
import SearchResultComponent from './components/SerachResultComponent.js';


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
        <Route path="/my" element={<MyPage />} />
        <Route path="/" element={<Main />} />

      </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
