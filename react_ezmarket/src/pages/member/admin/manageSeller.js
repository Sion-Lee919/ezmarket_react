import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie'

const ManageSeller = () => {
  const [allBrands, setAllBrands] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //관리자가 아니면 리디렉션
  useEffect(() => {
    const token = Cookies.get('jwt_token');  

    if (token) {
        axios.get('http://localhost:9090/userinfo', { 
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
      .get("http://localhost:9090/getAllBrands") 
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
  const handleAccept = (brand_id) => {
    if (window.confirm("정말 판매자의 신청을 승인하시겠습니까?")) {
    axios
      .post("http://localhost:9090/sellAccept", null, {
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
  const handleRefuse = (brand_id) => {
    if (window.confirm(`정말 ${brand_id}의 신청을 거절하시겠습니까?`)) {
      const comment = prompt("거절 사유를 입력하세요:");
      if (!comment) return;

      axios
        .post("http://localhost:9090/sellRefuse", null, {
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
  const handleCancel = (brand_id) => {
    if (window.confirm("정말 판매자의 승인을 취소하시겠습니까?")) {
      const comment = prompt("승인 취소 사유를 입력하세요:");
      if (!comment) return;

      axios
        .post("http://localhost:9090/sellRefuse", null, {
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
    <div>
      <h2>판매자 관리</h2>
        <table border="1">
          <thead>
            <tr>
              <th>판매자 신청 날짜</th>
              <th>정보 수정 날짜</th>
              <th>상호명</th>
              <th>사업자 번호</th>
              <th>브랜드 로고</th>
              <th>사업자 등록증</th>
              <th>아이디</th>
              <th>이름</th>
              <th>판매자 사이트</th>
              <th>신청 상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allBrands.map((brand) => (
              <tr key={brand.brand_number}>
                <td>{brand.brand_join_date}</td>
                <td>{brand.brand_update_date}</td>
                <td>{brand.brandname}</td>
                <td>{brand.brand_number}</td>
                <td><img src={brand.brandlogo_url} alt="브랜드 로고" /></td>
                <td><img src={brand.brandlicense_url} alt="사업자 등록증" /></td>
                <td>{brand.username}</td>
                <td>{brand.realname}</td>
                <td><a href={`../../brand/${brand.brand_id}`}>이동</a></td>
                <td>{brand.brand_status}</td>
                <td>
                  {brand.brand_status === "검토 중" && (
                    <>
                      <button onClick={() => handleAccept(brand.brand_id)}>승인</button>
                      <button onClick={() => handleRefuse(brand.brand_id)}>거절</button>
                    </>
                  )}
                  {brand.brand_status == "승인" && (
                      <button onClick={() => handleCancel(brand.brand_id)}>승인 취소</button>
                  )}
                  {brand.brand_status == "거절" && (
                      <button onClick={() => handleAccept(brand.brand_id)}>승인</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default ManageSeller;