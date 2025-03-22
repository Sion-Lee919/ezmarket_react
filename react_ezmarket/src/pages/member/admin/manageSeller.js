import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie'
import MyPageSideBar from '../my/myPageSideBar';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const ManageSeller = () => {
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
            alert(error.response.data.message); 
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
        
        // "신청 중"인 브랜드를 위로 정렬
        const submitBrands = sortedBrands.filter((brand) => brand.brand_status === "검토 중");
        const acceptBrands = sortedBrands.filter((brand) => brand.brand_status === "승인");
        const refuseBrands = sortedBrands.filter((brand) => brand.brand_status === "거절");
        setAllBrands([...submitBrands, ...acceptBrands, ...refuseBrands]);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
      });
  }, []);

  // 판매자 신청 수락
  const handleAccept = (brand_id, username) => {
    if (window.confirm(`정말 ${username}의 판매자 신청을 승인하시겠습니까?`)) {
    axios
      .post(`${API_BASE_URL}/sellAccept`, null, {
        params: { brand_id },
      })
      .then(() => {
        alert("판매자 신청 승인 완료");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("승인 오류 발생!");
      });
    }
  };

  // 판매자 신청 거절
  const handleRefuse = (brand_id, username) => {
    if (window.confirm(`정말 ${username}의 판매자 신청을 거절하시겠습니까?`)) {
      const comment = prompt("거절 사유를 입력하세요:");
      if (!comment) return;

      axios
        .post(`${API_BASE_URL}/sellRefuse`, null, {
          params: { brand_id, brand_refusal_comment: comment },
        })
        .then(() => {
          alert("판매자 신청 거절 완료");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          alert("거절 오류 발생!");
        });
      }
  };

  // 판매자 승인 취소
  const handleCancel = (brand_id, username) => {
    if (window.confirm(`정말 ${username}의 판매자 승인을 취소하시겠습니까?`)) {
      const comment = prompt("승인 취소 사유를 입력하세요:");
      if (!comment) return;

      axios
        .post(`${API_BASE_URL}/sellRefuse`, null, {
          params: { brand_id, brand_refusal_comment: comment },
        })
        .then(() => {
          alert("판매자 승인 취소 완료");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          alert("승인 취소 오류 발생!");
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
                <th style={{width:'10%'}}>신청 날짜</th>
                <th style={{width:'10%'}}>수정 날짜</th>
                <th style={{width:'8%'}}>상호명</th>
                <th style={{width:'10%'}}>사업자<br></br>번호</th>
                <th style={{width:'10%'}}>브랜드<br></br>로고</th>
                <th style={{width:'10%'}}>사업자<br></br>등록증</th>
                <th style={{width:'8%'}}>아이디</th>
                <th style={{width:'8%'}}>이름</th>
                <th style={{width:'5%'}}>판매자<br></br>사이트</th>
                <th style={{width:'5%'}}>신청<br></br>상태</th>
                <th style={{width:'5%'}}></th>
              </tr>
            </thead>
            <tbody style={{height: '350px'}}>
              {allBrands.map((brand) => (
                <tr key={brand.brand_number}>
                  <td>{brand.brand_join_date}</td>
                  <td>{brand.brand_update_date}</td>
                  <td>{brand.brandname}</td>
                  <td>{brand.brand_number}</td>
                  <td><img src={`${API_BASE_URL}/showimage?filename=${brand.brandlogo_url}&obj=brand`} alt="브랜드 로고" style = {{ width:'70%', objectFit: 'cover' }} /></td>
                  <td  style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em', whiteSpace: 'nowrap'}}>
                    <a href={`${API_BASE_URL}/downloadFile?filename=${brand.brandlicense_url}`} target="_blank" rel="noopener noreferrer">
                      {brand.brandlicense_url}
                    </a>
                  </td>
                  <td style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em', whiteSpace: 'nowrap'}}>{brand.username}</td>
                  <td>{brand.realname}</td>
                  <td><a href={`../../brand/${brand.brand_id}`}>이동</a></td>
                  <td>{brand.brand_status}</td>
                  <td>
                    {brand.brand_status === "검토 중" && (
                      <>
                        <button className="positive-button" onClick={() => handleAccept(brand.brand_id, brand.username)}>승인</button>
                        <button className="negative-button" onClick={() => handleRefuse(brand.brand_id, brand.username)}>거절</button>
                      </>
                    )}
                    {brand.brand_status == "승인" && (
                        <button className="negative-button" onClick={() => handleCancel(brand.brand_id, brand.username)}>승인취소</button>
                    )}
                    {brand.brand_status == "거절" && (
                        <button className="positive-button" onClick={() => handleAccept(brand.brand_id, brand.username)}>승인</button>
                    )}
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

export default ManageSeller;