import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../styles/FindIdPw.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const FindPw = () => {
    const [username, setUsername] = useState('');
    const [realname, setRealname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleFindPw = () => {
        if (!username || !realname || !email || !phone) {
            alert('모든 입력칸을 채워주세요.');
            return;
        }

        axios.post(`${API_BASE_URL}/findPw`, {
            username,
            realname,
            email,
            phone
        })
        .then(response => {
            alert(response.data.message); 
            sessionStorage.setItem('findPwValid', 'true');
            navigate(`/login/findPw/resetPw?username=${username}`); 
        })
        .catch(error => {
            alert(error.response.data.message);  
        });
    };

    const handleLoginClick = () => {
        navigate('/login');
      };
    
      const handlePasswordFindClick = () => {
        navigate('/login/findId');
      };

    return (
        <div className="id-pw-find-container">
            <div className="find-flow">
                <div className="find-title">ID/PW찾기</div>
            </div>
            <hr></hr>
            <div className="id-find-title">
                비밀번호 찾기<hr></hr>
            </div>
            <div className="pw-find-container">
                <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" placeholder="이름" value={realname} onChange={(e) => setRealname(e.target.value)} />
                <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                <button className="pw-find-button" onClick={handleFindPw}>비밀번호 찾기</button>
            </div>
            <hr></hr>
            <div>
                <button className="home-find" onClick={handleLoginClick}>
                    로그인
                </button>
                <button className="home-find" onClick={handlePasswordFindClick}>
                    아이디 찾기
                </button>
            </div>
        </div>
        
    );
};

export default FindPw;