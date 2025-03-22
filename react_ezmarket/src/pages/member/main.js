import { useNavigate } from 'react-router-dom';
import ItemSlideComponent from '../../components/ItemSlideComponent';
import KakaomapShopInfoComponent from '../../components/KakaomapShopInfoComponent';
import MainBannerSlide from "../../components/MainBannerSlide";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get(`${API_BASE_URL}/userinfo`, { 
        headers: { 'Authorization': `Bearer ${token}` }, 
        withCredentials: true
      })
      .then(response => {
        setUser(response.data);
        if(response.data.phone === "010-0000-0000") {
          alert('소셜로그인 사용자는 전화번호 업데이트가 필요합니다!')
          navigate('/my/modify');
        }
      })
      .catch(error => {
        Cookies.remove('jwt_token');
        navigate('/login');
      });
    }
  }, [navigate]);

  return (
    <div>
      <MainBannerSlide />
      <ItemSlideComponent></ItemSlideComponent>
      <hr/>
      <h1>가까운 양조장</h1>
      <KakaomapShopInfoComponent></KakaomapShopInfoComponent>
    </div>
  );
};

export default Main;
