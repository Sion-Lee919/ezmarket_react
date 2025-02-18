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
  const [BrandNumberCheckResult, setBrandNumberCheckResult] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  
  const navigate = useNavigate();
  
  // brand_id 생성
  const generateUniqueId = () => {
    return ((Date.now() % 1000000000000000) * (Math.floor(Math.random() * 9) + 1)); 
  };

  useEffect(() => {
    const uniqueId = generateUniqueId();
    setForm(prevForm => ({ 
      ...prevForm,
      brand_id: uniqueId,
    }));
  }, []);

  // 토큰에서 정보 가져오기
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
          member_id: response.data.member_id,
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

  //중복 확인
  const checkBrandNumber = async (e) => {
    const enteredBrandNumber = e.target.value;
    setForm({ ...form, brand_number: enteredBrandNumber });

    if (enteredBrandNumber.length === 0) {
      setBrandNumberCheckResult('');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9090/checkBrandNumber', {
        params: { brand_number: enteredBrandNumber },
      });

      setBrandNumberCheckResult(response.data);
      if (response.data === "중복된 사업자 번호입니다.") {
        setIsSubmitDisabled(true);
      } else {
        setIsSubmitDisabled(false);
      }
    } catch (error) {
      console.error('사업자 번호 중복 확인 오류', error);
    }
  };

  //판매자 신청 폼 제출
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
        const response = await axios.post('http://localhost:9090/sellApplication', formData, {
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
          <input type="text" id="brandName" value={form.brandname} onChange={(e) => setForm({ ...form, brandname: e.target.value })} maxLength={100} required />
        </div>
        <div>
          <label htmlFor="brandNumber">사업자 번호: </label>
          <input type="text" id="brandNumber" value={form.brand_number} onChange={checkBrandNumber} placeholder="'-'를 제외한 사업자 번호 10자리를 적어주세요." pattern="\d{10}" title="'-'를 제외한 사업자 번호 10자리를 적어주세요." maxLength={10} required />
          <span>{BrandNumberCheckResult}</span>
        </div>
        <div>
          <label htmlFor="brandLicenseFile">사업자 등록증: </label>
          <input type="file" id="brandLicenseFile" onChange={handleFileChange}
          />
        </div>
        <button type="submit" disabled={isSubmitDisabled}>판매자 신청</button>
      </form>
    </div>
  );
};

export default SellerApplication;