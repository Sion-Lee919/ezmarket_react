import { useNavigate } from 'react-router-dom'; 

const Main = () => {

  const navigate = useNavigate();  

  const handleMyPageClick = () => {
    navigate('/my');  
  };


  return (
    <div>
      <button onClick={handleMyPageClick}>
        내 정보
      </button>
    </div>
  );
};

export default Main;