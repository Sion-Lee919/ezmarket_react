import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate(); 

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const data = {
          username: username,
          password: password
      };

      axios.post('http://localhost:9090/login', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
       .then(response => {
            const token = response.data.token;
            localStorage.setItem('token', token);
            if (response.status === 200) {
                navigate('/');  
            }
        })
        .catch(error => {
            alert(error.response.data.message); 
        });
    };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleJoinClick = () => {
    navigate('/join');
  };

  const handleNaverLogin = () => {
    window.location.href = 'http://localhost:9090/oauth2/authorization/naver';
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
        <button onClick={handleHomeClick}>
          홈
        </button>
      </form>
      <div>
        <button onClick={handleNaverLogin}>네이버 로그인</button>
    </div>
    </div>
  );
};

export default Login;