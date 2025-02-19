import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SellerModify = () => {
  const [form, setForm] = useState({
    brandname: "",
    brand_number: "",
    brandlogo_url: "",
    brandlicense_url: ""
  });

  const navigate = useNavigate();

  //토큰 받아오기
  useEffect(() => {
    const token = Cookies.get('jwt_token'); 
    
    if (token) {
      axios.get('http://localhost:9090/userinfo', { 
        headers: { 'Authorization': `Bearer ${token}` }, 
        withCredentials: true
      })
      .then(response => {
        setForm(response.data);
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

    try {
      await axios.post('http://localhost:9090/sellermodify', form, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      alert('판매자 정보 수정 성공!');
      navigate('../');
    } catch (error) {
      alert('판매자 정보 수정 실패!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="brand_id" value={Number(form.brand_id)} />
        </div>

        <div>
          <label htmlFor="brandname">상호명: </label>
          <input type="text" name="brandname" value={form.brandname} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="brand_number">사업자번호: </label>
          <input type="text" name="brand_number" value={form.brand_number} onChange={handleChange} disabled />
        </div>

        <div>
          <label htmlFor="brandlogo_url">상표 로고: </label>
          <input type="text" name="brandlogo_url" value={form.brandlogo_url} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="brandlicense_url">사업자 등록증: </label>
          <input type="text" name="brandlicense_url" value={form.brandlicense_url} onChange={handleChange} disabled />
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