import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/FindIdPw.css';

const ResetPw = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate(); 
    const location = useLocation();

    //접근 시 비밀번호 찾기 유효성 검사 필요
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const usernameFromUrl = params.get('username');

        const isFindPwValid = sessionStorage.getItem('findPwValid');

        if (!isFindPwValid) {
            alert('잘못된 접근입니다. 비밀번호 찾기를 먼저 진행해주세요.');
            navigate('/login/findPw'); 
            sessionStorage.removeItem('findPwValid');
            return;
        }

        if (usernameFromUrl) {
            setUsername(usernameFromUrl);
        } else {
            alert('유효하지 않은 사용자입니다. 다시 시도해주세요.');
            navigate('/login/findPw'); 
            sessionStorage.removeItem('findPwValid');
        }

        sessionStorage.removeItem('findPwValid');
        
    }, [location]);

    //비밀번호 재설정
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
        <div className="id-pw-find-container">
            <div className="find-flow">
                <div className="find-title">ID/PW찾기</div>
            </div>
            <hr></hr>
            <div className="id-find-title">
                비밀번호 재설정<hr></hr>
            </div>
            <input type="password" placeholder="새로 설정할 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} maxLength={100} />
            <input type="password" placeholder="비밀번호 재입력" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} maxLength={100} />
            <hr></hr>
            <button className="pw-find-button" onClick={handleChangePassword}>비밀번호 변경</button>
        </div>
    );
};

export default ResetPw;