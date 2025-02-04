import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  

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
    axios.get('/userinfo')  
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
      });
  }, []);

  const handleLogout = () => {
    axios.get('/logout')  
      .then(() => {
        navigate('/login');  
      })
      .catch((error) => {
        console.error('로그아웃 실패', error);
      });
  };

  return (
    <div>
      <h1>내 정보</h1>
      <div>
      <label>멤버 아이디: </label>
      <input type="text" value={user.member_id} disabled />
      </div>
      <div>
        <label>아이디: </label>
        <input type="text" value={user.username} disabled />
      </div>

      <div>
        <label>이름: </label>
        <input type="text" value={user.realname} disabled />
      </div>

      <div>
        <label>이메일: </label>
        <input type="email" value={user.email} disabled />
      </div>

      <div>
        <label>전화번호: </label>
        <input type="text" value={user.phone} disabled />
      </div>

      <div>
        <label>주소: </label>
        <input type="text" value={user.address} disabled />
      </div>

      <button onClick={handleLogout}>로그아웃</button>

      <button onClick={() => navigate(-1)}>이전</button>
    </div>
  );
};

export default MyPage;