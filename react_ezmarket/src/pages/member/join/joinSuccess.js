import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../../styles/JoinN.css';

const JoinSuccess = () => {
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
      navigate('/login'); 
  };

  const handleHomeClick = () => {
      navigate('/');
  };

  return (
    <div className="join-form-container">
      <div className="join-flow">
        <div className="join-flow-title">회원가입</div>
        <div>01 약관동의 → 02 회원 가입 → <span className="join-flow-content">03 가입 완료</span></div>
      </div>
      <hr></hr>
      <div className="join-form">
        <div className="join-form-title">
          회원가입 완료<hr></hr>
        </div>
        <div className="join-success-content">
          <div>
            회원 가입이 성공적으로 완료되었습니다!<br></br>
            <br></br>
          </div>
          <div>
            회원가입 기념 적립금 <span className="join-money">3000원</span>이 지급되었습니다.<br></br>
            <br></br>
            이제 로그인하여 이지마켓을 이용해보세요!<br></br>
            <br></br>
          </div>
          <hr></hr>
          <div className="join-button-form">
            <button onClick={handleHomeClick} className="prev-join">
              홈
            </button>
            <button onClick={handleLoginClick} className="next-join">
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSuccess;