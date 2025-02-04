import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const Main = () => {
  const navigate = useNavigate();  

  const handleMyPageClick = () => {
    navigate('/my');  
  };

  const handleLoginClick = () => {
    navigate('/login');  
  };

  return (
    <div>
      <button onClick={handleMyPageClick}>
        내 정보
      </button>

      <button onClick={handleLoginClick}>
        로그인
      </button>
    </div>
  );
};

export default Main;