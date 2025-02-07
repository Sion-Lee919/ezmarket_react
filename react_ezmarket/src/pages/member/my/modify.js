import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Modify = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    realname: '',
    nickname: '',
    email_name: "",
    email_domain: "",
    email_extension: "",
    email: "",
    phone_first: "010",
    phone_second: "",
    phone_third: "",
    phone: '',
    address: '',
  });

  const [nicknameCheckResult, setNicknameCheckResult] = useState('');
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //기존 정보 불러오기
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usernameFromUrl = params.get('username');;
    if (usernameFromUrl) {
      setForm((prevForm) => ({
        ...prevForm,
        username: usernameFromUrl, 
      }));
      fetchUserData(usernameFromUrl);
    }
  }, [location.search]);

  const fetchUserData = (username) => {
    fetch(`http://localhost:9090/user/data?username=${username}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setForm((prevForm) => ({
          ...prevForm,
          realname: data.realname,
          nickname: data.nickname,
          email_name: data.email_name,
          email_domain: data.email_domain,
          email_extension: data.email_extension,
          email: data.email,
          phone_first: data.phone_first, 
          phone_second: data.phone_second,
          phone_third: data.phone_third,
          phone: data.phone,
          address: data.address,
        }));
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

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

    try {
      await axios.post('http://localhost:9090/modify', form, {
        headers: { "Content-Type": "application/json" } 
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
          <input type="text" name="username" value={form.username} onChange={handleChange} maxLength={12} required readOnly />
        </div>

        <div>
          <label htmlFor="password">비밀번호: </label>
          <input type="password" name="password" value={form.password} onChange={handleChange} maxLength={100} required />
        </div>

        <div>
          <label htmlFor="realname">이름: </label>
          <input type="text" name="realname" value={form.realname} onChange={handleChange} maxLength={10} required readOnly />
        </div>

        <div>
          <label htmlFor="nickname">닉네임: </label>
          <input type="text" name="nickname" value={form.nickname} onChange={checkNickname} maxLength={12} required />
          <span>{nicknameCheckResult}</span>
        </div>

        <div>
          <label htmlFor="email">이메일: </label>
          <div>
            <input type="text" name="email_name" value={form.email_name} onChange={handleChange} maxLength={40} required readOnly />
            @
            <input type="text" name="email_domain" value={form.email_domain} onChange={handleChange} maxLength={50} required readOnly />
            .
            <select name="email_extension" value={form.email_extesnion} onChange={handleChange}>
              <option value="com">com</option>
              <option value="kr">kr</option>
              <option value="net">net</option>
            </select>
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
            <input type="text" name="phone_second" value={form.phone_second} onChange={handleChange} pattern="\d{3,4}" title="3~4개의 숫자로 입력하세요." maxLength={4} required readOnly />
            -
            <input type="text" name="phone_third" value={form.phone_third} onChange={handleChange} pattern="\d{4}" title="4개의 숫자로 입력하세요." maxLength={4} required readOnly />
          </div>
        </div>

        <div>
          <label htmlFor="address">주소: </label>
          <input type="text" name="address" value={form.address} onChange={handleChange} maxLength={1000} />
        </div>

        <div>
          <button type="submit" disabled={isRegisterDisabled}>수정하기</button>
          <button type="button" onClick={() => navigate(-1)}>이전</button>
        </div>
      </form>
    </div>
  );
};

export default Modify;