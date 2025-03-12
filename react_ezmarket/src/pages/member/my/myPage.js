import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPage.css';
import MyPageSideBar from './myPageSideBar';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const MyPage = () => {
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

  const handleAdminPageClick = () => {
    navigate(`/my/admin`);
  }

  const handleSellerPageClick = () => {
    navigate(`/brand/${user.brand_id}`);
  }

  return (
    <div className="mypage-form">
      <MyPageSideBar></MyPageSideBar>
      <div className="mypage-info">
        <div className="mypage-box-info">
          {user.userauthor === 0 && (
          <button className="admin-page-button" onClick={handleAdminPageClick}>관리자 페이지</button>
          )}
          {user.userauthor === 2 && (
          <button className="seller-page-button" onClick={handleSellerPageClick}>판매자 페이지</button>
          )}
          {user.realname}님은 <br></br> {user.userauthor === 0 ? "관리자" : user.userauthor === 2 ? "판매자" : "일반회원"}입니다<br></br>
        </div>
        <div className="mypage-box-info">
          <img src="/images/tempo1.png" alt="임시 이미지1" className="point-image"></img>
          <div>적립금</div>
          <div><span className="mypage-point">{user.points}</span>원</div>
        </div>
        <div className="mypage-box-info">
        <img src="/images/tempo2.png" alt="임시 이미지2" className="mileage-image"></img>
          <div>충전금</div> 
          <div><span className="mypage-money">{user.ezpay}</span>원</div>
        </div>

        <div className="mypage-box-order-flow">
          {user.username}의 주문 내역 진행 상황을 보여줄 계획
          <div className="order-flow-detail">
              <div>
                <div>결제 완료</div>
                <div className="order-flow-box">
                  숫자
                </div>
              </div>
              <div>
                <div>상품 준비중</div>
                <div className="order-flow-box">
                  숫자
                </div>
              </div>
              <div>
                <div>배송중</div>
                <div className="order-flow-box">
                  숫자
                </div>
              </div>
              <div>
                <div>배송 완료</div>
                <div className="order-flow-box">
                  숫자
                </div>
              </div>
          </div> 
        </div>
        <div className="mypage-box-order-image">
          {user.username}의 최근 주문 내역을 이미지로 5개 보여주고, 누르면 상품페이지로 이동할 계획
          <div className="order-image-detail">
            <div>
              <div>상품1</div>
              <div className="order-image-box">
                <a href="localhost:3000/item/brand-url">
                  <img src="brand-image-url" alt="최근 1번"></img>
                </a>
              </div>
            </div>
            <div>
              <div>상품2</div>
              <div className="order-image-box">
                <a href="localhost:3000/item/brand-url">
                  <img src="brand-image-url" alt="최근 2번"></img>
                </a>
              </div>
            </div>
            <div>
              <div>상품3</div>
              <div className="order-image-box">
                <a href="localhost:3000/item/brand-url">
                  <img src="brand-image-url" alt="최근 3번"></img>
                </a>
              </div>
            </div>
            <div>
              <div>상품4</div>
              <div className="order-image-box">
                <a href="localhost:3000/item/brand-url">
                  <img src="brand-image-url" alt="최근 4번"></img>
                </a>
              </div>
            </div>
            <div>
              <div>상품5</div>
              <div className="order-image-box">
                <a href="localhost:3000/item/brand-url">
                  <img src="brand-image-url" alt="최근 5번"></img>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;