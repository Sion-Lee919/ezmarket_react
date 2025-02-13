import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Modify = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    realname: "",
    nickname: "",
    email: "",
    phone: "",
    address: "",
    social: "",
  });

  const [nicknameCheckResult, setNicknameCheckResult] = useState('');
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);
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
        console.error('사용자 정보를 가져오는 데 실패.', error);
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  //중복 확인
  const checkNickname = async (e) => {
    const enteredNickname = e.target.value;
    setForm({ ...form, nickname: enteredNickname });

    if (enteredNickname.length === 0) {
      setNicknameCheckResult('');
      return;
    }      

    try {
      const response = await axios.get('http://localhost:9090/checkNickname', {
        params: { nickname: enteredNickname },
      });

      setNicknameCheckResult(response.data);
      setIsRegisterDisabled(response.data.includes('중복된 닉네임'));
    } catch (error) {
        console.error('닉네임 중복 확인 오류', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('jwt_token');

    try {
      await axios.post('http://localhost:9090/modify', form, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 토큰 추가
        }
      });
      alert('회원 정보 수정 성공!');
      navigate('/login');
    } catch (error) {
      alert('회원 정보 수정 실패!');
      console.error('회원 정보 수정 오류:', error);
    }
  };

  return (
    <div>
      <h1>회원 정보 수정</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="member_id" value={Number(form.member_id)} />
        </div>

        <div>
          <label htmlFor="username">아이디: </label>
          <input type="text" name="username" value={form.username} onChange={handleChange} disabled />
        </div>

        <div>
          <label htmlFor="password">비밀번호: </label>
          <input type="password" name="password" value={form.password} onChange={handleChange} maxLength={100} required disabled={form.social === 1}/>
        </div>

        <div>
          <label htmlFor="realname">이름: </label>
          <input type="text" name="realname" value={form.realname} onChange={handleChange} disabled />
        </div>

        <div>
          <label htmlFor="nickname">닉네임: </label>
          <input type="text" name="nickname" value={form.nickname} onChange={checkNickname} maxLength={12} required />
          <span>{nicknameCheckResult}</span>
        </div>

        <div>
          <label htmlFor="email">이메일: </label>
          <input type="text" name="email" value={form.email} onChange={handleChange} maxLength={40} disabled />
        </div>

        <div>
          <label htmlFor="phone">전화번호: </label>
          <input type="text" name="phone" value={form.phone} disabled/>
        </div>

        <div>
          <label htmlFor="address">주소: </label>
          <input type="text" name="address" value={form.address} onChange={handleChange} maxLength={1000} />
        </div>

        <div>
          <button type="submit" disabled={isRegisterDisabled}>수정하기</button>
          <button type="button" onClick={() => navigate(-1)}>이전</button>
        </div>
        <div>
        <button type="submit">탈퇴하기</button>
        </div>
      </form>
    </div>
  );
};

export default Modify;