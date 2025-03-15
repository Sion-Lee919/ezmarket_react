import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPage.css';
import MyPageSideBar from './myPageSideBar';
import QnAChatComponent from '../../../components/QnAChatComponent';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const MyQna = () => {
  const [user, setUser] = useState({
      member_id: '',
    });

  const[qnaList, setQnaList] = useState([]);
  const[selectedQna, setSelectedQna] = useState(null);
  const navigate = useNavigate();
  
  //로그인 안했을 때 내정보 접근시 리디렉트
  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get(`${API_BASE_URL}/userinfo`, { 
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

  //문의 목록 가져오기
  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get(`${API_BASE_URL}/getMyChat`, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      })
      .then(response => {
        const groupedQna = groupByChannelId(response.data);
        setQnaList(Object.values(groupedQna));
      })
      .catch((error) => {
        console.log("문의를 가져오는 데 오류가 발생했습니다.");
      });

    } else {
      navigate('/login');
    }
  }, [navigate]);

  const groupByChannelId = (data) => {
    return data.reduce((acc, qna) => {
      if (!acc[qna.channel_id]) {
        acc[qna.channel_id] = qna;
      } else {
        const existingQna = acc[qna.channel_id];
        if (new Date(qna.created_at) > new Date(existingQna.created_at)) {
          acc[qna.channel_id] = qna;
        }
      }
      return acc;
    }, {});
  };

  //문의 선택
  const handleQnaClick = (index) => {
    setSelectedQna(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <div className="mypage-form">
      <MyPageSideBar></MyPageSideBar>
      <div className="mypage-info">
      {qnaList.length > 0 && qnaList.map((qna, index) => (
        <div key={index} className="my-history">
          <div className="history-detail" >
            <div> 
              <div className="history-box" style={{ width: '50px' }}>
                <a href={`/item/${qna.product_id}`}>
                  <img src={qna.image_url} alt="상품 이미지"></img>
                </a>
              </div>
              </div>
              <div>
                <div className="history-box" style={{ width: '80px', maxHeight: '120px', overflow: 'auto' , wordBreak: 'break-word'}}>
                  {qna.name}
                </div>
              </div>
              <div>
                <div className="history-box" onClick={() => handleQnaClick(index)} style={{ cursor: 'pointer', width: '500px'}}>
                {qna.chat}
                </div>
              </div>
              <div>
                <div className="history-box">
                  {new Date(qna.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
            {selectedQna === index && (
              <div className="chat-box" style={{ position: 'relative', zIndex: 1 }}>
                <QnAChatComponent channel_id={qna.channel_id} /> 
              </div>
            )}
          </div> 
        ))}
      </div>
    </div>
  );
};

export default MyQna;