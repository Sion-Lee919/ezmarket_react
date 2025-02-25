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
  });

  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [brandLicenseFile, setBrandLicenseFile] = useState(null);

  const [BrandNumberCheckResult, setBrandNumberCheckResult] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  
  const navigate = useNavigate();
  
  // brand_id 생성
  const generateUniqueId = () => {
    return ((Date.now() % 100000) * (Math.floor(Math.random() * 9) + 1)); 
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
        const brand_id = response.data.brand_id;
        const brand_status = response.data.brand_status;
        if (brand_id) {
          if(brand_status === "승인") {
            alert('이미 판매자로 승인된 상태입니다. 판매자 페이지로 이동합니다.');
            return navigate(`/brand/${brand_id}`);
          } else if (brand_status === "검토 중") {
            alert('관리자가 판매자 신청을 검토 중입니다.')
          } else {
            alert('판매자 승인 거부된 상태입니다. 관리자에게 문의해주세요.')
          }
            navigate('/');
        }
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

    if (!brandLogoFile || !brandLicenseFile) {
      alert('상호 로고와 사업자 등록증 파일을 모두 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('brand_id', form.brand_id);
    formData.append('member_id', form.member_id);
    formData.append('brandname', form.brandname);
    formData.append('brand_number', form.brand_number);
    formData.append('brandlogo_url', brandLogoFile);
    formData.append('brandlicense_url', brandLicenseFile); 

    try {
      const response = await axios.post('http://localhost:9090/sellApplication', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('판매자 신청이 완료되었습니다.');
        navigate("/");
      } else {
        alert('신청 실패. 다시 시도해 주세요.');
      }
    } catch (error) {
      alert('서버 오류. 잠시 후 다시 시도해 주세요.');
    }
  };

  //로고 미리보기
  const handleBrandLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
          <label htmlFor="brandLicenseFile">상호 로고: </label>
          {brandLogoPreview && <img src={brandLogoPreview} alt="상호 로고 미리보기"/>}
          <input type="file" id="brandLogoFile" accept="image/*" onChange={handleBrandLogoChange} required />
        </div>
        <div>
          <label htmlFor="brandNumber">사업자 번호: </label>
          <input type="text" id="brandNumber" value={form.brand_number} onChange={checkBrandNumber} placeholder="'-'를 제외한 사업자 번호 10자리를 적어주세요." pattern="\d{10}" title="'-'를 제외한 사업자 번호 10자리를 적어주세요." maxLength={10} required />
          {form.brand_number.length === 10 && <span>{BrandNumberCheckResult}</span>}
        </div>
        <div>
          <label htmlFor="brandLicenseFile">사업자 등록증: </label>
          <input type="file" id="brandLicenseFile" accept="application/pdf" onChange={(e) => setBrandLicenseFile(e.target.files[0])} required />
        </div>
        <button type="submit" disabled={isSubmitDisabled}>판매자 신청</button>
      </form>
    </div>
  );
};

export default SellerApplication;