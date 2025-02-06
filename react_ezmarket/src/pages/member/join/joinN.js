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
    email_name: "",
    email_domain: "",
    email_extension: "com",
    email: "",
    phone_first: "010",
    phone_second: "",
    phone_third: "",
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
      checkRegisterDisabled(response.data, nicknameCheckResult, emailCheckResult, phoneCheckResult);
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
      checkRegisterDisabled(idCheckResult, response.data, emailCheckResult, phoneCheckResult);
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

  useEffect(() => {
    const { email_name, email_domain, email_extension } = form;
    const merge_email = `${email_name}@${email_domain}.${email_extension}`;

    const { phone_first, phone_second, phone_third } = form;
    const merge_phone = `${phone_first}-${phone_second}-${phone_third}`;

  setForm((prevForm) => ({
      ...prevForm,
      email: merge_email,
      phone: merge_phone,
    }));

    checkEmail(merge_email);
    checkPhone(merge_phone);

  }, [form.email_name, form.email_domain, form.email_extension, form.phone_first, form.phone_second, form.phone_third]);


  const checkEmail = async (fullEmail) => {
    if (fullEmail.length === 0) {
      setEmailCheckResult('');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9090/checkEmail', {
        params: { email: fullEmail },
      });

      setEmailCheckResult(response.data);
      checkRegisterDisabled(idCheckResult, response.data, nicknameCheckResult, phoneCheckResult);
    } catch (error) {
      console.error('이메일 중복 확인 오류', error);
    }
  };

  const checkPhone = async (fullPhone) => {
    if (fullPhone.length === 0) {
      setPhoneCheckResult('');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9090/checkPhone', {
        params: { phone: fullPhone },
      });

      setPhoneCheckResult(response.data);
      checkRegisterDisabled(idCheckResult, response.data, nicknameCheckResult, emailCheckResult);
    } catch (error) {
      console.error('전화번호 중복 확인 오류', error);
    }
  };
  
  const checkRegisterDisabled = (idResult, nicknameResult, emailResult, phoneResult) => {
	  if (
	  idResult.includes('중복된 아이디') ||
	  nicknameResult.includes('중복된 닉네임') ||
	  emailResult.includes('중복된 이메일') ||
	  phoneResult.includes('중복된 전화번호')
	  ) {
		setIsRegisterDisabled(true);
	  } else {
		setIsRegisterDisabled(false);  
	  }
  }


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
          <div>
            <input type="text" name="email_name" value={form.email_name} onChange={handleChange} maxLength={40} required />
            @
            <input type="text" name="email_domain" value={form.email_domain} onChange={handleChange} maxLength={50} required />
            .
            <select name="email_extension" value={form.email_extesnion} onChange={handleChange}>
              <option value="com">com</option>
              <option value="kr">kr</option>
              <option value="net">net</option>
            </select>
            <span>{emailCheckResult}</span>
          </div>
        </div>

        <div>
          <label htmlFor="phone">전화번호: </label>
          <div>
            <select name="phone_first" value={form.phone_first} onChange={handleChange}>
            <option value="010">010</option>
            <option value="011">011</option>
            </select>
            -
            <input type="text" name="phone_second" value={form.phone_second} onChange={handleChange} pattern="\d{3,4}" title="3~4개의 숫자로 입력하세요." maxLength={4} required />
            -
            <input type="text" name="phone_third" value={form.phone_third} onChange={handleChange} pattern="\d{4}" title="4개의 숫자로 입력하세요." maxLength={4} required />
            <span>{phoneCheckResult}</span>
          </div>
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