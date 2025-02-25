//import './App.css';
import React from 'react';

import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';



import GoogleLoginButton from './components/GoogleLoginButton';

import Cart from './components/Cart';
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
import ItemRegister from './components/Itemregister.js';
import Modifyitem from './components/Modifyitem.js';
import FooterComponent from './components/FooterComponent.js';

import KakaoLogin from './components/KakaoLogin';
import KakaoRedirectHandler from './components/KakaoRedirectHandler';
import SellerApplication from './pages/member/seller/sellerApplicatoin.js';
import ManageSeller from './pages/member/admin/manageSeller.js';
import AdminPage from './pages/member/admin/adminPage.js';
import ManageUser from './pages/member/admin/manageUser.js';
import SellerModify from './pages/member/seller/sellerModify.js';

function App() {
  
  return (

    <div>
      <BrowserRouter>
      <HeaderComponent/>
      
      <Routes> 
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/item/:itemid' element={<ItemDetail/>}/>

        <Route path='/brand/:brandid' element={<BrandPage/>}/>
        <Route path='/brand/:brandid/itemregister/' element={<ItemRegister/>}/>
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
        <Route path="/commerce" element={<SellerApplication />} />
        <Route path="/my/admin" element={<AdminPage/>} />
        <Route path="/my/admin/user" element={<ManageUser />} />
        <Route path="/my/admin/seller" element={<ManageSeller />} />
        <Route path='/brand/:brandid/modify/' element={<SellerModify/>}/>
        
        
        <Route path="/loginn" element={<GoogleLoginButton />} />
        <Route path="/brand/:brandid/modify/:productid" element={<Modifyitem/>} />
        <Route path="/kakao/login" element={<KakaoLogin />} />
        <Route path="/api/login/oauth2/code/kakao" element={<KakaoRedirectHandler />} />
      </Routes>
      <FooterComponent/>
      </BrowserRouter>
    </div>

  );
}

export default App;
