import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPage.css';
import MyPageSideBar from './myPageSideBar';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const MyLike = () => {
  const [user, setUser] = useState({
      member_id: '',
    });

  const[likes, setLikes] = useState([]);
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

  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get(`${API_BASE_URL}/getLike`, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      })
      .then(likeResponse => {
        setLikes(likeResponse.data);
      })
      .catch(likeError => {
        console.log("찜 목록을 가져오는 데 문제가 발생했습니다.");
      });

    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="mypage-form">
      <MyPageSideBar></MyPageSideBar>
      <div className="mypage-info">
      {likes.length > 0 && likes.map((like, index) => (
        <div key={index} className="my-history">
          <a href={`/item/${like.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="history-detail">
            <div> 
              <div className="history-box" style={{ width: '50px' }}>
                <img src={`${API_BASE_URL}/showimage?filename=${like.image_url}&obj=product`} width="80" height="80" alt="상품 이미지" />
              </div>
              </div>
              <div>
                <div className="history-box" style={{ width: '80px', maxHeight: '120px', overflow: 'auto' , wordBreak: 'break-word'}}>
                  {like.name}
                </div>
              </div>
              <div>
                <div className="history-box" style={{ width: '360px', maxHeight: '120px', overflow: 'auto' , wordBreak: 'break-word'}}>
                  {like.description}
                </div>
              </div>
              <div className="history-box" style={{ width: '50px' }}>
                  {like.price}원
              </div>
              <div>
                <div className="history-box" style={{ width: '50px', maxHeight: '120px', overflow: 'auto' , wordBreak: 'break-word'}}>
                  {like.volume}ml
                </div>
              </div>
              <div>
                <div className="history-box" style={{ width: '50px', maxHeight: '120px', overflow: 'auto' , wordBreak: 'break-word'}}>
                  {like.alcohol}º
                </div>
              </div>
            </div>
            </a>
          </div> 
        ))}
      </div>
    </div>
  );
};

export default MyLike;