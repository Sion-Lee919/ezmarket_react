import { Link, useNavigate } from "react-router-dom";
import { SearchComponent } from "./SearchComponent";

import { useState } from "react";
import { useEffect } from "react";
import Cookies from 'js-cookie';

import BrandPageLink from "./BrandPageLink";
import CategoryComponent from "./CategoryComponent";
import "../styles/HeaderComponent.css";


const HeaderComponent = () => {


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
          setIsLoggedIn(true);  
        }
      }, []);

      const handleLoginClick = () => {
        navigate('/login');  
      };

    const handleLogout = () => {
        Cookies.remove('jwt_token'); 
        alert('로그아웃 되었습니다.');
        navigate('/login');
        window.location.reload();
      }

    const handleMyPageClick = () => {
        navigate('/my');  
    };

    return (
    <div className="header">
        <Link to="/">이지마켓</Link><CategoryComponent></CategoryComponent>
        <Link to="/cart">장바구니</Link><br/>

        {!isLoggedIn && (
        <button onClick={handleLoginClick}>
          로그인
        </button>
        )}
        {isLoggedIn && (
        <button onClick={handleLogout}>로그아웃</button>
        )}


        <BrandPageLink></BrandPageLink>

        <SearchComponent></SearchComponent>
        <div>
      <button onClick={handleMyPageClick}>
        내 정보
      </button>

    </div>
    </div>
    
    )
}

export default HeaderComponent;