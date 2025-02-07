import React from "react";
import kakaoLoginImage from "../assets/kakao_login_large_wide.png";

const KakaoLogin = () => {
  const REST_API_KEY = "c0841fbae75476b0a18ac9c9644e416c";
  const REDIRECT_URI = "http://localhost:9090/api/login/oauth2/code/kakao";
  
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  
  const handleLogin = () => {
    window.location.href = kakaoAuthUrl;
  };
  
  return (
    <button 
      onClick={handleLogin}
      style={{ border: "none", padding: 0, background: "none", cursor: "pointer" }}
    >
      <img
        src={kakaoLoginImage}
        alt="카카오 로그인"
        style={{ width: "200px" }}
      />
    </button>
  );
};

export default KakaoLogin;