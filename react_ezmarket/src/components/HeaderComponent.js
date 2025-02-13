import { Link, useNavigate } from "react-router-dom";
import { SearchComponent } from "./SearchComponent";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Cookies from 'js-cookie';

const HeaderComponent = () => {
    const brandid = 1;
    // const [user, setUser] = useState({
    //     member_id: '',
    //     username: '',
    //     realname: '',
    //     phone: '',
    //     email: '',
    //     address: ''
    //   });

    // useEffect(() => {
    //     axios.get('/userinfo')  
    //       .then(response => {
    //         setUser(response.data);
    //       })
    //       .catch(error => {
    //         console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
    //       });
    //   }, []);
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

    return (
    <div>
        <Link to="/">이지마켓</Link><br/>
        <Link to="/cart">장바구니</Link><br/>
        <Link to={`/brand/${brandid}`}>판매자페이지</Link>

        {!isLoggedIn && (
        <button onClick={handleLoginClick}>
          로그인
        </button>
        )}
        {isLoggedIn && (
        <button onClick={handleLogout}>로그아웃</button>
        )}

        <SearchComponent></SearchComponent>

    </div>
    )
}

export default HeaderComponent;