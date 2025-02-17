import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 

const SellerApplication = () => {
  const [form, setForm] = useState({
    brand_id: '',
    member_id: '',
    brandname: '',
    brand_number: '',
    brandlicense_url: '',
  });

  const [brandLicenseFile, setBrandLicenseFile] = useState(null);
  
  const navigate = useNavigate();
  
  // brand_id 생성
  const generateUniqueId = () => {
    return ((Date.now() % 1000000000000000) * Math.floor(Math.random() * 10)); 
  };

  useEffect(() => {
    const uniqueId = generateUniqueId();
    setForm(prevForm => ({ 
      ...prevForm,
      brand_id: uniqueId,
    }));
  }, []);

  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get('http://localhost:9090/userinfo', { 
        headers: { 'Authorization': `Bearer ${token}` }, 
        withCredentials: true
      })
      .then(response => {
        setForm(prevForm => ({
          ...prevForm,
          member_id: response.data.member_id,  // 응답에서 member_id를 가져와서 상태에 저장
        }));
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

  const handleFileChange = (e) => {
    setBrandLicenseFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reader = new FileReader(); // 파일(사진) 불러오기 위해 추가

    reader.onloadend = async () => {
      const formData = {
        brand_id: form.brand_id,
        member_id: form.member_id,
        brandname: form.brandname,
        brand_number: form.brand_number,
        brandlicense_url: reader.result,
      };

      try {
        const response = await axios.post('http://localhost:9090/sell_application', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          alert('판매자 신청이 완료되었습니다.');
        } else {
          alert('신청 실패. 다시 시도해 주세요.');
        }
      } catch (error) {
        alert('서버 오류. 잠시 후 다시 시도해 주세요.');
      }
    };
    
    if (brandLicenseFile) {
      reader.readAsDataURL(brandLicenseFile);  // 파일을 Base64로 읽기
    } else {
      alert('파일을 선택하세요');
    }
  };

  return (
    <div>
      <h2>판매자 신청</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="brand_id" value={form.brand_id} />
          <input type="hidden" name="member_id" value={form.member_id} />
        </div>

        <div>
          <label htmlFor="brandName">상호명: </label>
          <input
            type="text"
            id="brandName"
            value={form.brandname}
            onChange={(e) => setForm({ ...form, brandname: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="brandNumber">사업자 번호: </label>
          <input
            type="text"
            id="brandNumber"
            value={form.brand_number}
            onChange={(e) => setForm({ ...form, brand_number: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="brandLicenseFile">사업자 등록증: </label>
          <input
            type="file"
            id="brandLicenseFile"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">판매자 신청</button>
      </form>
    </div>
  );
};

export default SellerApplication;