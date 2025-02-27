import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../../styles/Join.css';

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
      alert('약관에 동의하지 않으면 회원가입 진행이 불가합니다.');
    }
  };

  const handlePrevClick = () => {
      navigate('/login');
  };

  return (
    <div className="join-term-container">
      <div className="join-flow">
        <div className="join-flow-title">회원가입</div>
        <div><span className="join-flow-content">01 약관동의</span> → 02 회원 가입 → 03 가입 완료</div>
      </div>
      <hr></hr>
      <div className="join-term">
        <div className="join-term-agree">
          약관 동의<hr></hr>
        </div>
        <div className="join-term-content">
          <strong>제1조 (목적)</strong><br></br>
          본 약관은 '이지마켓' 회원가입 절차 및 이용자와 회사 간의 권리, 의무, 책임 사항을 규정합니다.<br></br>
          <br></br>
          <strong>제2조 (회원가입)</strong><br></br>
          1. 회원가입을 위해 필요한 정보는 아이디, 이름, 비밀번호, 닉네임, 이메일, 전화번호입니다.<br></br>
          2. 회원가입을 완료한 사용자는 본 서비스의 모든 기능을 이용할 수 있습니다.<br></br>
          3. 회원가입 시 제공된 정보는 정확해야 하며, 허위 정보 입력 시 서비스 이용이 제한될 수 있습니다.<br></br>
          4. 사용자는 가입 후 언제든지 자신의 정보를 수정할 수 있으며, 개인정보 변경 사항이 있을 경우 수정하지 않을 시 발생하는 문제에 대해 회사는 책임을 지지 않습니다.<br></br>
          <br></br>
          <strong>제3조 (서비스 이용)</strong><br></br>
          1. 회원가입 후 제공되는 서비스는 본 사이트에서 제공하는 모든 기능을 포함합니다.<br></br>
          2. 회사는 회원이 원활하게 서비스를 이용할 수 있도록 지속적으로 유지·관리합니다.<br></br>
          3. 서비스 이용 중 고객님의 과실로 인한 문제에 대해서 회사는 해결 책임을 지지 않습니다.<br></br>
          4. 서비스 이용 중 고객님의 과실로 인한 문제에 대해서 회사는 해결 책임을 지지 않습니다.<br></br>
          5. 회사는 서비스 품질 향상을 위해 정기적으로 업데이트 및 점검을 진행할 수 있으며, 이에 따라 일시적인 서비스 중단이 발생할 수 있습니다.<br></br>
          <br></br>
          <strong>제4조 (회원탈퇴)</strong><br></br>
          1. 회원은 언제든지 회원 탈퇴를 요청할 수 있습니다.<br></br>
          2. 탈퇴 후, 모든 회원 정보는 1년간 보관 뒤 자동으로 삭제됩니다.<br></br>
          3. 탈퇴한 회원의 정보 복구는 1년 이내에 관리자에게 문의해주세요.<br></br>
          4. 회원이 다음 사항에 해당하는 경우, 회사는 사전 통보 없이 강제 탈퇴를 진행할 수 있습니다.<br></br>
          &nbsp;&nbsp;&nbsp;&nbsp;- 불법적인 행위를 하거나 회사 정책을 위반한 경우<br></br>
          &nbsp;&nbsp;&nbsp;&nbsp;- 타인의 권리를 침해하거나 명예를 훼손하는 행위를 한 경우<br></br>
        </div>
      
        <div className="essential-terms">
          <input type="checkbox" id="terms" className="checkbox-join-custom" checked={agreeToTerms} onChange={handleTermsChange} />
          <label htmlFor="terms">
            <span className="required-text">[필수]</span>이용 약관
          </label>
        </div>
        <hr></hr>
        <div>
          <button onClick={handlePrevClick} className="prev-join">
            이전
          </button>
          <button onClick={handleNextClick} className="next-join">
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;