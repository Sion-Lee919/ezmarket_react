import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPage.css';
import MyPageSideBar from './myPageSideBar';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const MyReview = () => {
  const [user, setUser] = useState({
      member_id: '',
    });

  const[reviews, setReviews] = useState([]);
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
      axios.get(`${API_BASE_URL}/getUserReviews`, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      })
      .then(reviewResponse => {
        setReviews(reviewResponse.data);
      })
      .catch(reviewError => {
        console.log("리뷰를 가져오는 데 문제가 발생했습니다.");
      });

    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="mypage-form">
      <MyPageSideBar></MyPageSideBar>
      <div className="mypage-info">
      {reviews.length > 0 && reviews.map((review, index) => (
        <div key={index} className="my-history">
          <a href={`/item/${review.product_id}?brand_id=${review.brand_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="history-detail">
            <div> 
              <div className="history-box" style={{ width: '50px' }}>
                <img src={`${API_BASE_URL}/showimage?filename=${review.product_image_url}&obj=product`} width="80" height="80" alt="상품 이미지" />
              </div>
              </div>
              <div>
                <div className="history-box" style={{ width: '80px', maxHeight: '120px', overflow: 'auto' , wordBreak: 'break-word'}}>
                  {review.name}
                </div>
              </div>
              <div className="history-box" style={{ width: '50px' }}>
                {review.image_url ? (
                  <img src={`${API_BASE_URL}/showimage?filename=${review.image_url}&obj=review`} width="80" height="80" alt="상품 이미지" />
                ) : (
                  <div style={{ height: '50px', width: '50px' }} /> 
                )}
              </div>
              <div>
                <div className="history-box" style={{ width: '200px', maxHeight: '120px', overflow: 'auto' , wordBreak: 'break-word'}}>
                  {review.comments}
                </div>
              </div>
              <div>
                <div className="history-box" style={{ marginLeft: '51px' }}>
                {'⭐'.repeat(review.rating)}
                </div>
              </div>
              <div>
                <div className="history-box">
                  {new Date(review.review_date).toLocaleDateString('ko-KR')}
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

export default MyReview;