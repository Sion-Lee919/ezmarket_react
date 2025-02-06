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
  //   axios.post('http://localhost:9090/logout',{ withCredentials: true }) 
  //     .then(() => {
  //       Cookies.remove('jwt_token'); 
  //       navigate('/login');  
  //     })
  //     .catch((error) => {
  //       console.error('로그아웃 실패', error);
  //     });
  // };
  // 백에서 처리하려고 했는데 302에러 해결 못해서 그냥 프론트에서만 지움 백에는 쿠키 남음

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