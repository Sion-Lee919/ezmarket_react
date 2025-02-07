import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPw = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate(); 
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const usernameFromUrl = params.get('username');
        if (usernameFromUrl) {
            setUsername(usernameFromUrl);
        }
    }, [location]);

    const handleChangePassword = () => {
        if (newPassword.trim() === '') {
            alert('새 비밀번호를 입력해주세요.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        axios.post('http://localhost:9090/resetPw', {
            username,
            newPassword
        })
        .then(response => {
            alert(response.data.message); 
            navigate('/login'); 
        })
        .catch(error => {
            alert(error.response.data.message);  
        });
    };

    return (
        <div>
            <h2>비밀번호 변경</h2>
            <input type="password" placeholder="새로 설정할 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} maxLength={100} />
            <input type="password" placeholder="비밀번호 재입력" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} maxLength={100} />
            <button onClick={handleChangePassword}>비밀번호 변경</button>
        </div>
    );
};

export default ResetPw;