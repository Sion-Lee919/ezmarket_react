import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const SellerModify = () => {
  const [form, setForm] = useState({
    brand_id: "",
    brandname: "",
    brand_number: "",
    brandlogo_url: "",
  });
  
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const navigate = useNavigate();

  //토큰 받아오기
  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get(`${API_BASE_URL}/userinfo`, { 
        headers: { 'Authorization': `Bearer ${token}` }, 
        withCredentials: true
      })
      .then(response => {
        setForm(response.data);
        setBrandLogoPreview(response.data.brandlogo_url);
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

  //판매자 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('jwt_token');
    const formData = new FormData();
    formData.append("brand_id", form.brand_id);
    formData.append("brandname", form.brandname);
    formData.append("brand_number", form.brand_number);
    if (brandLogoFile) {
      formData.append("brandlogo_url", brandLogoFile); 
    } else {
      formData.append("existing_brandlogo_url", form.brandlogo_url);
    }

    try {
      await axios.post(`${API_BASE_URL}/sellModify`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      alert('판매자 정보 수정 성공!');
      navigate(`/brand/${form.brand_id}`);
    } catch (error) {
      alert('판매자 정보 수정 실패!');
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
      <h1>판매자 정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="brand_id" value={Number(form.brand_id)} />
        </div>

        <div>
          <label htmlFor="brandname">상호명: </label>
          <input type="text" name="brandname" value={form.brandname} onChange={(e) => setForm({ ...form, brandname: e.target.value })} />
        </div>

        <div>
          <label htmlFor="brand_number">사업자번호: </label>
          <input type="text" name="brand_number" value={form.brand_number} onChange={(e) => setForm({ ...form, brand_number: e.target.value })} disabled />
        </div>

        <div>
          <label htmlFor="brandLicenseFile">상호 로고: </label>
          {/* {form.brandlogo_url && !previewLogo && (<img src={aws 배포 후 설정} alt="상호 로고") */}
          {brandLogoPreview && <img src={brandLogoPreview} alt="상호 로고 미리보기"/>}
          <input type="file" id="brandLogoFile" accept="image/*" onChange={handleBrandLogoChange} />
        </div>
        
        <div>
          <button type="submit">수정하기</button>
          <button type="button" onClick={() => navigate(-1)}>이전</button>
        </div>

      </form>
    </div>
  );
};

export default SellerModify;