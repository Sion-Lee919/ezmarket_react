import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

function GoogleLoginButton() {
    // 구글 로그인 버튼 클릭 시 백엔드 OAuth2 로그인 경로로 이동
    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    };
    return (
        <div>
            <h1>로그인</h1>
            <button onClick={handleGoogleLogin}>
                <span>구글로 로그인</span>
            </button>
        </div>
    );
}

export default GoogleLoginButton;