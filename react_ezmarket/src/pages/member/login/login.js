import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    axios.post('/login', params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )
      .then(response => {
        navigate('/');
      })
      .catch(error => {
        alert('아이디 혹은 비밀번호가 틀렸습니다.');
      });
  };

  const handlePrevClick = () => {
    navigate(-1);
  };

  const handleJoinClick = () => {
    navigate('/join');
  };

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-box">
          아이디 입력: <input type="text" className="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/><br />
          암호 입력: <input type="password" name="pw" value={password} onChange={(e) => setPassword(e.target.value)}/><br />
        </div>
        <input className="button" type="submit" value="로그인" />
        <button onClick={handleJoinClick}>
          회원가입
        </button>
        <button onClick={handlePrevClick}>
          이전
        </button>
      </form>
      <div>
      <a href="/oauth2/authorization/naver">
        <img
          src="https://static.nid.naver.com/oauth/big_g.PNG"
          alt="네이버 로그인"
        />
      </a>
    </div>
    </div>
  );
};

export default Login;