import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import '../../../styles/MyPage.css';
import MyPageSideBar from './myPageSideBar';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

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

  const [orderCounts, setOrderCounts] = useState({
    preparing: 0,
    shipping: 0,
    shipped: 0,
    return: 0
  });

  // 쿠키에서 최근 본 상품 목록 가져오기
  const [recently_viewed, setRecently_viewed] = useState([]);

  useEffect(() => {
    const viewed_items = JSON.parse(Cookies.get('recently_viewed') || '[]');
    setRecently_viewed(viewed_items); 
}, []);
  
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

  //주문 상황 가져오기
  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
        
    if (token) {
      axios.get(`${API_BASE_URL}/buy/orderFlowCount`, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      })
        .then((response) => {
          setOrderCounts(response.data);
        })
        .catch((error) => {
          console.error('주문 상황 가져오기 실패:', error);
        });
    }}, []);  

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
          {user.userauthor === 1 && (
          <button className="admin-page-button" onClick={handleAdminPageClick} style = {{ pointerEvents: 'none' }}>총 구매 회수는 {orderCounts.preparing+orderCounts.shipping+orderCounts.shipped+orderCounts.return}회 입니다.</button>
          )}
          {user.userauthor === 2 && (
          <button className="seller-page-button" onClick={handleSellerPageClick}>판매자 페이지</button>
          )}
          <div style={{ fontSize : "18px" , fontWeight: "bold" }}>{user.realname}님은 <br></br> {user.userauthor === 0 ? <span style ={{ color: "red" }}>"관리자"</span> : user.userauthor === 2 ? <span style = {{ color: "blue" }}>"판매자"</span> : <span style = {{ color: "green" }}>"일반회원"</span>}입니다</div>
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
          <div className="order-flow-detail">
              <div>
                <div>상품 준비중</div>
                <div className="order-flow-box">
                  <img src="/images/preparing.jpg" alt="결제 확인"></img>
                </div>
                <div className="order-flow-count">{orderCounts.preparing}</div>
              </div>
              <div>
                <div>배송중</div>
                <div className="order-flow-box">
                 <img src="/images/delivering.jpg" alt="배송중"></img>
                </div>
                <div className="order-flow-count">{orderCounts.shipping}</div>
              </div>
              <div>
                <div>배송 완료</div>
                <div className="order-flow-box">
                  <img src="/images/delivered.jpg" alt="배송 완료"></img>
                </div>
                <div className="order-flow-count">{orderCounts.shipped}</div>
              </div>
              <div>
                <div>반품</div>
                <div className="order-flow-box">
                  <img src="/images/pay.jpg" alt="반품"></img>
                </div>
                <div className="order-flow-count">{orderCounts.return}</div>
              </div>
          </div> 
        </div>
        <div className="mypage-box-order-image">
          <div style={{ fontSize : "18px" , fontWeight: "bold", marginBottom: "10px" }}>최근 본 게시물</div>
          <div className="order-image-detail">
            <div>
              <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '130px'}}>{recently_viewed[0] ? recently_viewed[0].name : '　'}</div>
              <div className="order-image-box">
                <a href={`/item/${recently_viewed[0] ? recently_viewed[0].product_id : '#'}`}
                style={recently_viewed[0] ? {} : { pointerEvents: 'none', cursor: 'not-allowed' }}>
                  <img src={recently_viewed[0] ? recently_viewed[0].image_url : 'https://img.freepik.com/free-vector/cross-mark-hand-drawn-scribble-line_78370-1425.jpg?semt=ais_hybrid'} alt={`1번`}/>
                </a>
              </div>
            </div>
            <div>
              <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '130px'}}>{recently_viewed[1] ? recently_viewed[1].name : '　'}</div>
              <div className="order-image-box">
                <a href={`/item/${recently_viewed[1] ? recently_viewed[1].product_id : '#'}`}
                style={recently_viewed[1] ? {} : { pointerEvents: 'none', cursor: 'not-allowed' }}>
                  <img src={recently_viewed[1] ? recently_viewed[1].image_url : 'https://img.freepik.com/free-vector/cross-mark-hand-drawn-scribble-line_78370-1425.jpg?semt=ais_hybrid'} alt={`2번`}/>
                </a>
              </div>
            </div>
            <div>
              <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '130px'}}>{recently_viewed[2] ? recently_viewed[2].name : '　'}</div>
              <div className="order-image-box">
                <a href={`/item/${recently_viewed[2] ? recently_viewed[2].product_id : '#'}`}
                style={recently_viewed[2] ? {} : { pointerEvents: 'none', cursor: 'not-allowed' }}>
                  <img src={recently_viewed[2] ? recently_viewed[2].image_url : 'https://img.freepik.com/free-vector/cross-mark-hand-drawn-scribble-line_78370-1425.jpg?semt=ais_hybrid'} alt={`3번`}/>
                </a>
              </div>
            </div>
            <div>
              <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '130px'}}>{recently_viewed[3] ? recently_viewed[3].name : '　'}</div>
              <div className="order-image-box">
                <a href={`/item/${recently_viewed[3] ? recently_viewed[3].product_id : '#'}`}
                style={recently_viewed[3] ? {} : { pointerEvents: 'none', cursor: 'not-allowed' }}>
                 <img src={recently_viewed[3] ? recently_viewed[3].image_url : 'https://img.freepik.com/free-vector/cross-mark-hand-drawn-scribble-line_78370-1425.jpg?semt=ais_hybrid'} alt={`4번`}/>
                </a>
              </div>
            </div>
            <div>
              <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '130px'}}>{recently_viewed[4] ? recently_viewed[4].name : '　'}</div>
              <div className="order-image-box">
                <a href={`/item/${recently_viewed[4] ? recently_viewed[4].product_id : '#'}`}
                style={recently_viewed[4] ? {} : { pointerEvents: 'none', cursor: 'not-allowed' }}>
                  <img src={recently_viewed[4] ? recently_viewed[4].image_url : 'https://img.freepik.com/free-vector/cross-mark-hand-drawn-scribble-line_78370-1425.jpg?semt=ais_hybrid'} alt={`5번`} />
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