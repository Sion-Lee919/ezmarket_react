import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../styles/FindIdPw.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const FindId = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [foundId, setFoundId] = useState('');
  const navigate = useNavigate(); 

  const handleFindId = (e) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
        alert('이메일 또는 전화번호를 입력해 주세요.');
        return;
    }

    axios.post(`${API_BASE_URL}/findId`, {
        emailOrPhone: emailOrPhone
    })
    .then(response => {
        setFoundId(response.data.username);
    })
    .catch(error => {
        alert(error.response.data.message);
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handlePasswordFindClick = () => {
    navigate('/login/findPw');
  };
  
  return (
    <div className="id-pw-find-container">
      <div className="find-flow">
        <div className="find-title">ID/PW찾기</div>
      </div>
      <hr></hr>
      <div className="id-find-title">
        아이디 찾기<hr></hr>
      </div>

      <form onSubmit={handleFindId}>
        <div className="id-find-content">
          <input type="text" placeholder="이메일 또는 전화번호 입력" value={emailOrPhone} pattern="^(?:\d{3}-\d{3,4}-\d{4}|[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})$" title="이메일은 XXXX@XXXX.XXX 형식, 전화번호는 010-XXXX-XXXX 형식으로 입력해주세요." onChange={(e) => setEmailOrPhone(e.target.value)} required/>
          <button className="id-find-button" type="submit">아이디 찾기</button> 
        </div>

        {foundId && (
        <div className="found-id-box">
          아이디: {foundId}
        </div>
      )}
      <hr></hr>
      </form>
        <button className="home-find" onClick={handleLoginClick}>
          로그인
        </button>
        <button className="home-find" onClick={handlePasswordFindClick}>
          비밀번호 찾기
        </button>
    </div>
  );
};

export default FindId;