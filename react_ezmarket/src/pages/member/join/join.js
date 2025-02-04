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
    } else {
      alert('약관에 동의해주세요.');
    }
  };

  const handlePrevClick = () => {
      navigate(-1);
  };

  return (
    <div>
      <h1>회원가입 약관</h1>
      <div>
        <p>
          여기에 회원가입 약관을 작성<br></br>
          여기에 회원가입 약관을 작성<br></br>
          여기에 회원가입 약관을 작성<br></br>
          여기에 회원가입 약관을 작성<br></br>
          여기에 회원가입 약관을 작성<br></br>
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