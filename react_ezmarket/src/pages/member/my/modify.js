import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../../styles/JoinN.css'

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
  const [passwordCheckResult, setPasswordCheckResult] = useState('');
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
        alert(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  
  //회원 수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('jwt_token');

    try {
      await axios.post('http://localhost:9090/modify', form, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      alert('회원 정보 수정 성공!');
      navigate('/login');
    } catch (error) {
      alert('회원 정보 수정 실패!');
    }
  };

  //회원 탈퇴
  const handleResign = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) {
      return;
    }

    const token = Cookies.get('jwt_token');

    try {
      if(form.social == 1) {
        alert('소셜 회원의 탈퇴는 관리자에게 문의해주세요.');
        return;
      } else if(form.brand_id) {
        alert('판매자 회원의 탈퇴는 관리자에게 문의해주세요.');
        return;
      }

      const response = await axios.post('http://localhost:9090/resign', null, {
        params: { username: form.username },
        headers: { 'Authorization': `Bearer ${token}` },
      });

      alert(response.data);
      
      Cookies.remove('jwt_token');
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('회원 탈퇴 요청 실패!');
    }
  };

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
        setIsRegisterDisabled(true);
      } else {
        setPasswordCheckResult('비밀번호가 일치합니다.');
        setIsRegisterDisabled(false);
      }
    } else {
      setPasswordCheckResult('');
      setIsRegisterDisabled(false);
    }
  }, [form.password, form.confirmPassword]);

  return (
    <div className="join-form-container">
      <div className="join-flow">
        <div className="join-flow-title">회원 정보</div>
      </div>
      <hr></hr>

      <form className="join-form" onSubmit={handleSubmit}>
        <div className="join-form-title">
            회원 정보 수정<hr></hr>
        </div>

        <div>
          <input type="hidden" name="member_id" value={Number(form.member_id)} />
        </div>

        <div>
          <input type="text" name="username" className="join-username" value={form.username} onChange={handleChange} disabled />
        </div>

        <div>
          <input type="password" name="password" className="join-password" value={form.password} onChange={handleChange} maxLength={100} required disabled={form.social == 1} placeholder="비밀번호"/>
        </div>

        <div>
          <input type="password" name="confirmPassword" className="join-password" value={form.confirmPassword} onChange={handlePasswordConfirm} maxLength={100} required placeholder="비밀번호 확인"/>
          <div className="check">{passwordCheckResult}</div>
        </div>

        <div>
          <input type="text" name="realname" className="join-realname" value={form.realname} onChange={handleChange} disabled />
        </div>

        <div>
          <input type="text" name="nickname" className="join-nickname" value={form.nickname} onChange={checkNickname} maxLength={12} required placeholder="닉네임 입력"/>
          <div className="check">{nicknameCheckResult}</div>
        </div>

        <div>
          <input type="text" name="email" value={form.email} onChange={handleChange} maxLength={40} disabled />
        </div>

        <div>
          <input type="text" name="phone" value={form.phone} disabled/>
        </div>

        <div>
          <input type="text" name="address" className="join-address" value={form.address} onChange={handleChange} maxLength={1000} placeholder="주소 입력" />
        </div>

        <div className="join-button-form">
          <button type="button" className="prev-join" onClick={() => navigate(-1)}>이전</button>
          <button type="submit" className="join-join" disabled={isRegisterDisabled}>수정하기</button>
        </div>
        <div>
          <button type="button" className="resign-modify" onClick={handleResign}>회원 탈퇴 요청</button>
        </div>
      </form>
    </div>
  );
};

export default Modify;