import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

        axios.post('http://localhost:9090/findPw', {
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

    return (
        <div>
            <h2>비밀번호 찾기</h2>
            <input type="text" placeholder="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="이름" value={realname} onChange={(e) => setRealname(e.target.value)} />
            <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            <button onClick={handleFindPw}>비밀번호 찾기</button>
        </div>
    );
};

export default FindPw;