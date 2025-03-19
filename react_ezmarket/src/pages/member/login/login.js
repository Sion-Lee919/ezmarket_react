import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../../styles/Login.css';
import { Placeholder } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";
const BASE_URL = process.env.REACT_APP_URL || "http://localhost:9090";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const location = useLocation();
    const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

    //토큰 있을 때 로그인 접근시 내 정보로 이동
    useEffect(() => {
      const token = Cookies.get('jwt_token');
      if (token) {
          navigate('/my');
      }
      }, [navigate]);        
    
    //로그인
    const handleSubmit = (event) => {
        event.preventDefault();
    
        const data = {
          username: username,
          password: password,
      };

      axios.post(`${API_BASE_URL}/login`, JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, 
      })

        .then(response => {  
            const token= response.data.token;

            localStorage.setItem('token', token);
            if (response.status === 200) {
                alert(response.data.message);
                navigate(redirectUrl);
            } 
            window.location.reload();
        })
        .catch(error => {
            alert(error.response.data.message);
        });
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
    window.location.href = `${BASE_URL}/oauth2/authorization/naver`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/github`;
  };

  return (
    <div>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '30px', marginLeft: '10px', marginBottom: '20px', fontWeight: "bold" }}>회원 로그인</h3>
          <div className="login-box">
            <div>
              <input type="text" className="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디"/><br />
              <input type="password" className="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호"/><br />
            </div>
            <input className="login-button" type="submit" value="로그인" />
          </div>
        </form>
        <hr></hr>
        <div className="member-buttons">
          <button className="join-login" onClick={handleJoinClick}>회원가입</button>
          <button className="id-find" onClick={handleFindIdClick}>아이디 찾기</button>
          <button className="pw-find" onClick={handleFindPwClick}>비밀번호 찾기</button>
        </div>
        <hr></hr>
        <div className="social-login">
          <button className="naver-login" onClick={handleNaverLogin}><img src="/social-login-icon/naver.svg" alt="네이버 로그인"/></button>
          <button className="google-login"onClick={handleGoogleLogin}><img src="/social-login-icon/google.svg" alt="구글 로그인 버튼"/></button>
          <button className="kakao-login"onClick={handleKakaoLogin}><img src="/social-login-icon/kakaotalk.svg" alt="카카오 로그인 버튼"/></button>
          <button className="github-login"onClick={handleGithubLogin}><img src="/social-login-icon/github.svg" alt="깃허브 로그인 버튼"/></button>
        </div>
      </div>
    </div>
  );
};

export default Login;