import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinN = () => {
  const [form, setForm] = useState({
    member_id: '',
    username: '',
    password: '',
    realname: '',
    nickname: '',
    email: '',
    phone: '',
    address: '',
  });

  const [idCheckResult, setIdCheckResult] = useState('');
  const [nicknameCheckResult, setNicknameCheckResult] = useState('');
  const [emailCheckResult, setEmailCheckResult] = useState('');
  const [phoneCheckResult, setPhoneCheckResult] = useState('');
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);
  const navigate = useNavigate();

  //member_id 생성
  const generateUniqueId = () => {
    return (Date.now() * Math.floor(Math.random() * 1000)); 
  };

  useEffect(() => {
    const uniqueId = generateUniqueId();
    setForm(prevForm => ({ 
      ...prevForm,
      member_id: uniqueId,
    }));
  }, [])

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value,});
  };

  //중복 확인
  const checkId = async (e) => {
    const enteredId = e.target.value;
    setForm({ ...form, username: enteredId });

    if (enteredId.length === 0) {
      setIdCheckResult('');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9090/checkId', {
        params: { username: enteredId },
      });

      setIdCheckResult(response.data);
      setIsRegisterDisabled(response.data.includes('중복된 아이디'));
    } catch (error) {
      console.error('아이디 중복 확인 오류', error);
    }
  };

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

  const checkEmail = async (e) => {
    const enteredEmail = e.target.value;
    setForm({ ...form, email: enteredEmail });

    if (enteredEmail.length === 0) {
      setEmailCheckResult('');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9090/checkEmail', {
        params: { email: enteredEmail },
      });

      setEmailCheckResult(response.data);
      setIsRegisterDisabled(response.data.includes('중복된 이메일'));
    } catch (error) {
      console.error('이메일 중복 확인 오류', error);
    }
  };

  const checkPhone = async (e) => {
    const enteredPhone = e.target.value;
    setForm({ ...form, phone: enteredPhone });

    if (enteredPhone.length === 0) {
      setPhoneCheckResult('');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9090/checkPhone', {
        params: { phone: enteredPhone },
      });

      setPhoneCheckResult(response.data);
      setIsRegisterDisabled(response.data.includes('중복된 전화번호'));
    } catch (error) {
      console.error('전화번호 중복 확인 오류', error);
    }
  };

  //회원가입 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:9090/joinN', form, {
        headers: { "Content-Type": "application/json" } //리액트 json, 스프링 @RequestBody로 받기
      });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      alert('회원가입 실패!');
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="hidden" name="member_id" value={Number(form.member_id)} />
        </div>

        <div>
          <label htmlFor="username">아이디: </label>
          <input type="text" name="username" value={form.username} onChange={checkId} maxLength={12} required />
          <span>{idCheckResult}</span>
        </div>

        <div>
          <label htmlFor="password">비밀번호: </label>
          <input type="password" name="password" value={form.password} onChange={handleChange} maxLength={100} required />
        </div>

        <div>
          <label htmlFor="realname">이름: </label>
          <input type="text" name="realname" value={form.realname} onChange={handleChange} maxLength={10} required />
        </div>

        <div>
          <label htmlFor="nickname">닉네임: </label>
          <input type="text" name="nickname" value={form.nickname} onChange={checkNickname} maxLength={12} required />
          <span>{nicknameCheckResult}</span>
        </div>

        <div>
          <label htmlFor="email">이메일: </label>
          <input type="email" name="email" value={form.email} onChange={checkEmail} placeholder="XXXX@XXXX.com/kr/net" maxLength={100} required />
          <span>{emailCheckResult}</span>
        </div>

        <div>
          <label htmlFor="phone">전화번호: </label>
          <input type="text" name="phone" value={form.phone} onChange={checkPhone} pattern="010-\d{3,4}-\d{4}" placeholder="010-XXXX-XXXX" title="010-XXXX-XXXX로 입력." required />
          <span>{phoneCheckResult}</span>
        </div>

        <div>
          <label htmlFor="address">주소: </label>
          <input type="text" name="address" value={form.address} onChange={handleChange} maxLength={1000} />
        </div>

        <div>
          <button type="submit" disabled={isRegisterDisabled}>가입하기</button>
          <button type="button" onClick={() => navigate(-1)}>이전</button>
        </div>
      </form>
    </div>
  );
};

export default JoinN;