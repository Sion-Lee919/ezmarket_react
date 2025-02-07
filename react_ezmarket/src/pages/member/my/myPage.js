import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';

const MyPage = () => {
  const [user, setUser] = useState({
    member_id: '',
    username: '',
    realname: '',
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
        console.error('사용자 정보를 가져오는 데 실패.', error);
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('jwt_token'); 
    navigate('/login');
  }

  const handleModify = () => {
    navigate(`/my/modify?username=${user.username}`);
  }

  return (
    <div>
      <h1>{user.nickname} 정보 페이지</h1>
      <div>
        {user.nickname}, {user.realname}, {user.phone}, {user.email}, {user.address};
      </div>
      <div>
        <button onClick={handleLogout}>로그아웃</button>
        <button onClick={() => navigate(-1)}>이전</button>
        <button onClick={handleModify}>회원정보수정</button>
      </div>
    </div>
  );
};

export default MyPage;