import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie'
import MyPageSideBar from '../my/myPageSideBar';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const ManageMoney = () => {
  const [allBrands, setAllBrands] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  //관리자가 아니면 리디렉션
  useEffect(() => {
    const token = Cookies.get('jwt_token');  

    if (token) {
        axios.get(`${API_BASE_URL}/userinfo`, { 
            headers: { 'Authorization': `Bearer ${token}` }, 
            withCredentials: true
        })
        .then(response => {
            setUser(response.data);  

            if (response.data.userauthor !== 0) {
                navigate('/login');
            }
        })
        .catch(error => {
            Cookies.remove('jwt_token');  
            navigate('/login');
        });
    } else {
        navigate('/login');  
    }
}, [navigate]);

  // 판매자 목록 가져오기
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/getAllBrands`) 
      .then((response) => {
        const sortedBrands = response.data;
        console.log(response);
        
        const filteredBrands = sortedBrands.filter((brand) => brand.calculating_money > 0);

        setAllBrands(filteredBrands);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패");
      });
  }, []);

  // 정산 신청 수락
  const handleAccept = (brand_id, calculating_money) => {
    if (window.confirm("정말 판매자의 정산 요청을 승인하시겠습니까?")) {
    axios
      .post(`${API_BASE_URL}/buy/calculateSuccess`, null, {
        params: { brand_id, request_money : calculating_money },
      })
      .then(() => {
        alert("정산 신청 승인 완료");
        window.location.reload();
      })
      .catch((error) => {
        alert("승인 오류 발생!");
      });
    }
  };

  // 정산 신청 거절
  const handleRefuse = (brand_id, calculating_money ) => {
    if (window.confirm(`정말 ${brand_id}의 정산 요청을 거절하시겠습니까?`)) {
      axios
        .post(`${API_BASE_URL}/buy/calculateRefuse`, null, {
          params: { brand_id, request_money : calculating_money },
        })
        .then(() => {
          alert("정산 신청 거절 완료");
          window.location.reload();
        })
        .catch((error) => {
          alert("거절 오류 발생!");
        });
      }
  };

  return (
    <div className="mypage-form">
      <MyPageSideBar></MyPageSideBar>
      <div className="mypage-info">
        <div className="manage-table">
          <table border="1" style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', border: '1px solid rgb(209, 198, 198)'}}>
            <thead>
              <tr>
                <th style={{width:'8%'}}>상호명</th>
                <th style={{width:'10%'}}>사업자<br></br>번호</th>
                <th style={{width:'10%'}}>브랜드<br></br>로고</th>
                <th style={{width:'8%'}}>아이디</th>
                <th style={{width:'8%'}}>이름</th>
                <th style={{width:'5%'}}>판매자<br></br>사이트</th>
                <th style={{width:'5%'}}>정산 신청<br></br>금액</th>
                <th style={{width:'5%'}}>정산 가능<br></br>금액</th>
                <th style={{width:'5%'}}></th>
              </tr>
            </thead>
            <tbody style={{height: '350px'}}>
              {allBrands.map((brand) => (
                <tr key={brand.brand_number}>
                  <td>{brand.brandname}</td>
                  <td>{brand.brand_number}</td>
                  <td><img src={brand.brandlogo_url} alt="브랜드 로고" /></td>
                  {/* 미리보기는 aws 배포 후 */}
                  <td style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em', whiteSpace: 'nowrap'}}>{brand.username}</td>
                  <td>{brand.realname}</td>
                  <td><a href={`../../brand/${brand.brand_id}`}>이동</a></td>
                  <td>{brand.calculating_money}</td>
                  <td>{brand.calculating_money + brand.calculate_possible}</td>
                  <td>
                      <button className="positive-button" onClick={() => handleAccept(brand.brand_id, brand.calculating_money)}>승인</button>
                      <button className="negative-button" onClick={() => handleRefuse(brand.brand_id, brand.calculating_money)}>거절</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
      </div>
    </div>
  );
};

export default ManageMoney;