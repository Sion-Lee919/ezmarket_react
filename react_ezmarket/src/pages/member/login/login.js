import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    //토큰 있을 때 로그인 접근시 내 정보로 이동
    useEffect(() => {
      const token = Cookies.get('jwt_token');
      if (token) {
          navigate('/my');
      }
    }, [navigate]);
  
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
                alert(response.data.message);
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

  const handleFindIdClick = () => {
    navigate('/login/findId');
  };

  const handleFindPwClick = () => {
    navigate('/login/findPw');
  };

  const handleNaverLogin = () => {
    window.location.href = 'http://localhost:9090/oauth2/authorization/naver';
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:9090/oauth2/authorization/google';
  };

  const handleKakaoLogin = () => {
    window.location.href = 'http://localhost:9090/oauth2/authorization/kakao';
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:9090/oauth2/authorization/github';
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
        <button onClick={handleJoinClick}>회원가입</button>
        <button onClick={handleHomeClick}>홈</button>
      </form>
      <div>
        <button onClick={handleFindIdClick}>아이디 찾기</button>
        <button onClick={handleFindPwClick}>비밀번호 찾기</button>
      </div>
      <div>
        <button onClick={handleNaverLogin}>네이버 로그인</button>
        <button onClick={handleGoogleLogin}>구글 로그인</button>
        <button onClick={handleKakaoLogin}>카카오 로그인</button>
        <button onClick={handleGithubLogin}>깃허브 로그인</button>
      </div>
    </div>
  );
};

export default Login;