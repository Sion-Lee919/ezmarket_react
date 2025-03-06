import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPageSideBar.css';


const MyPageSideBar = () => {
    const [user, setUser] = useState({
      member_id: '',
      username: '',
      realname: '',
      nickname: '',
      phone: '',
      email: '',
      address: ''
    });
  
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = Cookies.get('jwt_token'); 
      
      if (token) {
        axios.get('http://localhost:9090/userinfo', { 
          headers: { 'Authorization': `Bearer ${token}` }, 
          withCredentials: true
        })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          alert(error.response.data.message);
          Cookies.remove('jwt_token');
          navigate('/login');
        });
      } else {
        navigate('/login');
      }
    }, [navigate]);
  
    const handleModify = () => {
      navigate(`/my/modify?username=${user.username}`);
    }
  

return(
    <div className="side-bar">

      <div className="side-bar-title">
        내 정보
      </div>
      <hr></hr>
      <div>
        <button>주문 목록</button>
      </div>
      <div>
        <button>찜 목록</button>
      </div>
      <hr style={{ width: "75px" }}></hr>
      <div>
        <button>상품 문의 내역</button>
      </div>
      <div>
        <button>1:1  문의 내역</button>
      </div>
      <hr style={{ width: "75px" }}></hr>
      <div>
        <button onClick={handleModify}>회원 정보 수정</button>
      </div>
      <hr style={{ width: "75px" }}></hr>
      <div>
        <button onClick={() => navigate(-1)}>이전</button>
      </div>
    </div>
    )
};


    export default MyPageSideBar;