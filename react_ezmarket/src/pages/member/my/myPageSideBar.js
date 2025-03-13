import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useLocation, useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPageSideBar.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const MyPageSideBar = () => {
    const [user, setUser] = useState({
      member_id: '',
      username: '',
      realname: '',
      nickname: '',
      phone: '',
      email: '',
      address: ''
    });
  
    const navigate = useNavigate();
    const location = useLocation();
    const [sideBarTitle, setSideBarTitle] = useState('내 정보');

    useEffect(() => {
      if (location.pathname === '/my/order') {
        setSideBarTitle('주문 목록');
      } else if (location.pathname === '/my/qna') {
        setSideBarTitle('상품 문의 내역');
      } else if (location.pathname === '/my/1-1qna') {
        setSideBarTitle('1:1 문의 내역');
      } else if (location.pathname === '/my/review') {
        setSideBarTitle('상품 후기 내역');
      } else {
        setSideBarTitle('내 정보');
      }
    }, [location.pathname]);
  
    useEffect(() => {
      const token = Cookies.get('jwt_token'); 
      
      if (token) {
        axios.get(`${API_BASE_URL}/userinfo`, { 
          headers: { 'Authorization': `Bearer ${token}` }, 
          withCredentials: true
        })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          alert(error.response.data.message);
          Cookies.remove('jwt_token');
          navigate('/login');
        });
      } else {
        navigate('/login');
      }
    }, [navigate]);
  
    const handleModify = () => {
      navigate(`/my/modify?username=${user.username}`);
    }

    const handleMyReview = () => {
      navigate(`/my/review`);
    }

    const handleOrder = () => {
      navigate(`/my/order`);
    }

return(
    <div className="side-bar">

      <div className="side-bar-title">
        {sideBarTitle}
      </div>
      <hr></hr>
      <div>
        <button onClick={handleOrder}>주문 목록</button>
      </div>
      <hr style={{ width: "75px" }}></hr>
      <div>
        <button>상품 문의 내역</button>
      </div>
      <div>
        <button>1:1  문의 내역</button>
      </div>
      <div>
        <button onClick={handleMyReview}>상품 후기 내역</button>
      </div>
      <hr style={{ width: "75px" }}></hr>
      <div>
        <button onClick={handleModify}>회원 정보 수정</button>
      </div>
      <hr style={{ width: "75px" }}></hr>
      <div>
        <button onClick={() => navigate(-1)}>이전</button>
      </div>
    </div>
    )
};


    export default MyPageSideBar;