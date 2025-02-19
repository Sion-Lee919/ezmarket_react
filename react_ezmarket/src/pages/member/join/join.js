import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Join = () => {
  const [agreeToTerms, setAgreeToTerms] = useState(false); 
  const navigate = useNavigate(); 

  const handleTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
  };

  const handleNextClick = () => {
    if (agreeToTerms) {
      navigate('/joinN'); 
      sessionStorage.setItem('joinValid', 'true');
    } else {
      alert('약관에 동의해주세요.');
    }
  };

  const handlePrevClick = () => {
      navigate('/login');
  };

  return (
    <div>
      <h1>회원가입 약관</h1>
      <div>
        <p>
        <strong>제 1 조 (목적)</strong><br></br>
        본 약관은 '이지마켓' 회원가입 절차 및 이용자와 회사 간의 권리, 의무, 책임 사항을 규정합니다.<br></br>
        <br></br>
        <strong>제 2 조 (회원가입)</strong><br></br>
        1. 회원가입을 위해 필요한 정보는 아이디, 이름, 비밀번호, 닉네임, 이메일, 전화번호입니다.<br></br>
        2. 회원가입을 완료한 사용자는 본 서비스의 모든 기능을 이용할 수 있습니다.<br></br>
        <br></br>
        <strong>제 3 조 (서비스 이용)</strong><br></br>
        1. 회원가입 후 제공되는 서비스는 본 사이트에서 제공하는 모든 기능을 포함합니다.<br></br>
        2. 서비스 이용 중 고객님의 과실로 인한 문제에 대해서 회사는 해결 책임을 지지 않습니다.<br></br>
        <br></br>
        <strong>제 4 조 (회원탈퇴)</strong><br></br>
        1. 회원은 언제든지 회원 탈퇴를 요청할 수 있습니다.<br></br>
        2. 탈퇴 후, 모든 회원 정보는 1년간 보관 뒤 자동으로 삭제됩니다.<br></br>
        3. 탈퇴한 회원의 정보 복구는 1년 이내에 관리자에게 문의해주세요..<br></br>
        </p>
      </div>
      
      <div>
        <input type="checkbox" id="terms" checked={agreeToTerms} onChange={handleTermsChange} />
        <label htmlFor="terms">약관에 동의합니다.</label>
      </div>

      <div>
        <button onClick={handleNextClick}>
          다음
        </button>
        <button onClick={handlePrevClick}>
          이전
        </button>
      </div>
    </div>
  );
};

export default Join;