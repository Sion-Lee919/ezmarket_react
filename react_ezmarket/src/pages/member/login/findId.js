import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindId = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const navigate = useNavigate(); 

  const handleFindId = () => {
    if (!emailOrPhone.trim()) {
        alert('이메일 또는 전화번호를 입력해 주세요.');
        return;
    }

    axios.post('http://localhost:9090/findId', {
        emailOrPhone: emailOrPhone
    })
    .then(response => {
        alert('아이디: ' + response.data.username);
    })
    .catch(error => {
        alert(error.response.data.message);
    });
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <div>
      <div>
        <h2>아이디 찾기</h2>
        <input type="text" placeholder="이메일 또는 전화번호 입력" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)}/>
        <button onClick={handleFindId}>아이디 찾기</button> 
        <p>이메일은 XXXX@XXXX.XXX, 전화번호는 010-XXXX-XXXX 형식으로 입력해주세요.</p>
    </div>
        <button onClick={handleHomeClick}>
          홈
        </button>
        <button onClick={handleLoginClick}>
          로그인
        </button>
    </div>
  );
};

export default FindId;