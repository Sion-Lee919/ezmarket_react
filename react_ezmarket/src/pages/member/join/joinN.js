import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../styles/JoinN.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const JoinN = () => {
  const [form, setForm] = useState({
    member_id: '',
    username: '',
    password: '',
    confirmPassword: '',
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
  const [passwordCheckResult, setPasswordCheckResult] = useState('');

  const navigate = useNavigate();

  //접근 시 회원가입 약간 동의 필요
  useEffect(() => {
    const isJoinValid = sessionStorage.getItem('joinValid');

    if (!isJoinValid) {
      alert('잘못된 접근입니다. 회원가입 약관 동의를 먼저 진행해주세요.');
      navigate('/join');
      sessionStorage.removeItem('joinValid');
    }

    sessionStorage.removeItem('joinValid');

  }, [navigate]);

  //member_id 생성
  const generateUniqueId = () => {
    return (((Date.now() % 100000000) * (Math.floor(Math.random() * 9) + 1))); 
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
      const response = await axios.get(`${API_BASE_URL}/checkId`, {
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
      const response = await axios.get(`${API_BASE_URL}/checkNickname`, {
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
      const response = await axios.get(`${API_BASE_URL}/checkEmail`, {
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
      const response = await axios.get(`${API_BASE_URL}/checkPhone`, {
        params: { phone: fullPhone },
      });

      setPhoneCheckResult(response.data);
      checkRegisterDisabled(idCheckResult, response.data, nicknameCheckResult, emailCheckResult);
    } catch (error) {
      console.error('전화번호 중복 확인 오류', error);
    }
  };

  useEffect(() => {
    checkRegisterDisabled(idCheckResult, nicknameCheckResult, emailCheckResult, phoneCheckResult, passwordCheckResult);
  }, [idCheckResult, nicknameCheckResult, emailCheckResult, phoneCheckResult, passwordCheckResult]);

  const checkRegisterDisabled = (idResult, nicknameResult, emailResult, phoneResult, passwordCheckResult) => {
    if (
      idResult.includes('중복된 아이디') ||
      nicknameResult.includes('중복된 닉네임') ||
      emailResult.includes('중복된 이메일') ||
      phoneResult.includes('중복된 전화번호') ||
      passwordCheckResult.includes('비밀번호가 틀립니다.')
    ) {
      setIsRegisterDisabled(true);
    } else {
      setIsRegisterDisabled(false);  
    }
  }

  //비밀번호 확인
  const handlePasswordConfirm = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (form.password && form.confirmPassword) {
      if (form.password !== form.confirmPassword) {
        setPasswordCheckResult('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordCheckResult('비밀번호가 일치합니다.');
      }
    } else {
      setPasswordCheckResult('');
    }
  }, [form.password, form.confirmPassword]);

  //회원가입 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/joinN`, form, {
        headers: { "Content-Type": "application/json" } //리액트 json, 스프링 @RequestBody로 받기
      });
      alert('회원가입 성공!');
      navigate('/joinN/success');
    } catch (error) {
      alert('회원가입 실패! 회원가입 정보를 다시 확인해주세요!');
    }
  };

  return (
    <div className="join-form-container">
      <div className="join-flow">
        <div className="join-flow-title">회원가입</div>
        <div>01 약관동의 → <span className="join-flow-content">02 회원 가입</span> → 03 가입 완료</div>
      </div>
      <hr></hr>

      <form className="join-form">
        <div className="join-form-title">
            회원가입<hr></hr>
        </div>

        <div>
          <input type="hidden" name="member_id" value={Number(form.member_id)} />
        </div>

        <div>
          <input type="text" name="username" className="join-username" value={form.username} onChange={checkId} maxLength={12} required placeholder="아이디"/>
          <div className="check">{idCheckResult}</div>
        </div>

        <div>
          <input type="password" name="password" className="join-password" value={form.password} onChange={handlePasswordConfirm} maxLength={100} required placeholder="비밀번호"/>
        </div>

        <div>
          <input type="password" name="confirmPassword" className="join-password" value={form.confirmPassword} onChange={handlePasswordConfirm} maxLength={100} required placeholder="비밀번호 확인"/>
          <div className="check">{passwordCheckResult}</div>
        </div>

        <div>
          <input type="text" name="realname" className="join-realname" value={form.realname} onChange={handleChange} maxLength={10} required placeholder="이름"/>
        </div>

        <div>
          <input type="text" name="nickname" className="join-nickname" value={form.nickname} onChange={checkNickname} maxLength={12} required placeholder="닉네임"/>
          <div className="check">{nicknameCheckResult}</div>
        </div>

        <div className="join-email">
          <div>
            <input type="text" name="email_name" className="join-email-first" value={form.email_name} onChange={handleChange} maxLength={40} required placeholder="이메일 아이디 입력"/>
            @
            <input type="text" name="email_domain" className="join-email-second" value={form.email_domain} onChange={handleChange} maxLength={50} required placeholder="이메일 도메인 입력"/>
            .
            <select name="email_extension" className="join-email-third" value={form.email_extesnion} onChange={handleChange}>
              <option value="com">com</option>
              <option value="kr">kr</option>
              <option value="net">net</option>
            </select>
            {form.email_name.length > 0  && form.email_domain.length > 0 && <div className="check">{emailCheckResult}</div>}
          </div>
        </div>

        <div className="join-phone">
          <div>
            <select name="phone_first" className="join-phone-first" value={form.phone_first} onChange={handleChange}>
            <option value="010">010</option>
            <option value="011">011</option>
            </select>
            -
            <input type="text" name="phone_second" className="join-phone-second" value={form.phone_second} onChange={handleChange} pattern="\d{3,4}" title="3~4개의 숫자로 입력하세요." maxLength={4} required placeholder="전화번호 앞 4자리" />
            -
            <input type="text" name="phone_third" className="join-phone-third" value={form.phone_third} onChange={handleChange} pattern="\d{4}" title="4개의 숫자로 입력하세요." maxLength={4} required placeholder="전화번호 뒤 4자리"/>
            {(form.phone_second.length === 3 || form.phone_second.length === 4) && form.phone_third.length === 4 && <div className="check">{phoneCheckResult}</div>}
          </div>
        </div>

        <div>
          <input type="text" name="address" className="join-address" value={form.address} onChange={handleChange} maxLength={1000} placeholder="주소 입력"/>
        </div>

        <hr></hr>

        <div className="join-button-form">
          <button type="button" className="prev-join" onClick={() => navigate(-1)}>이전</button>
          <button type="submit" className="join-join" onClick={handleSubmit} disabled={isRegisterDisabled}>가입하기</button>
        </div>
      </form>
    </div>
  );
};

export default JoinN;