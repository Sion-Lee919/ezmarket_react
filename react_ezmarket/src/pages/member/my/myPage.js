import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPage.css';
import MyPageSideBar from './myPageSideBar';

const MyPage = () => {
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

  //로그인 안했을 때 내정보 접근시 리디렉트
  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get('http://localhost:9090/userinfo', { 
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

  const handleAdminPageClick = () => {
    navigate(`/my/admin`);
  }

  return (
    <div className="mypage-form">
      <MyPageSideBar />
      <div>
        <div>{user.realname}님은 {user.author === 0 ? "관리자" : user.userauthor === 2 ? "판매자" : "일반회원"}입니다.</div>
        <div>적립금: {user.points}원</div>
        <div>충전금: {user.ezpay}원</div>
      </div>
      <div className="side-bar">
      <div>
          {user.username}의 주문 내역을 보여줄 계획
        </div>
      </div>
    </div>
  );
};

export default MyPage;