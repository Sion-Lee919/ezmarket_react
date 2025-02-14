import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';

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

  return (
    <div>
      <h1>{user.nickname}님의 정보</h1>
      <div>
        적립금: {user.points}원, 충전금: {user.ezpay}원;
      </div>
      <div>
        {user.username}의 주문 내역을 보여줄 계획
      </div>
      <div>
        <button>찜 목록</button>
      </div>
      <div>
        <button>상품 문의</button>
      </div>
      <div>
        <button>1:1  문의</button>
      </div>
      <div>
        <button onClick={handleModify}>회원정보수정</button>
      </div>
      <div>
        <button onClick={() => navigate(-1)}>이전</button>
      </div>
    </div>
  );
};

export default MyPage;