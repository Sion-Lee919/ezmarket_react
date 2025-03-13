import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const ManageUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //관리자가 아니면 리디렉션
  useEffect(() => {
    const token = Cookies.get('jwt_token');  

    if (token) {
        axios.get(`${API_BASE_URL}/userinfo`, { 
            headers: { 'Authorization': `Bearer ${token}` }, 
            withCredentials: true
        })
        .then(response => {
            setUser(response.data);  

            if (response.data.userauthor !== 0) {
                navigate('/login');
            }
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

  // 유저 목록 가져오기
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/getAllUsers`) 
      .then((response) => {
        setAllUsers(response.data);
      })
      .catch((error) => {
        console.error("데이터 가져오기 실패:", error);
      });
  }, []);

  //사용자 강퇴
  const handleKick = (member_id) => {
    if (window.confirm(`정말 ${member_id}를 강퇴하시겠습니까?`)) {
      const comment = prompt("강퇴 사유를 입력하세요:");
      if (!comment) return;

      axios
        .post(`${API_BASE_URL}/kick`, null, {
          params: { member_id, member_kick_comment: comment },
        })
        .then(() => {
          alert("사용자 강퇴 완료");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          alert("강퇴 오류 발생!");
        });
      }
  };

  //사용자 복구 -> 1년 이내
  const handleRestore = (member_id) => {
    if (window.confirm(`정말 ${member_id}의 정보를 복구 하시겠습니까?`)) {

      axios
        .post(`${API_BASE_URL}/restore`, null, {
          params: { member_id, member_kick_comment: '공백처리' },
        })
        .then(() => {
          alert("사용자 복구 완료");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          alert("복구 오류 발생!");
        });
      }
  };


  return (
    <div>
      <h2>유저 관리</h2>
        <table border="1">
          <thead>
            <tr>
              <th>가입 날짜</th>
              <th>정보 수정 날짜</th>
              <th>ID</th>
              <th>이름</th>
              <th>닉네임</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>주소</th>
              <th>회원 상태</th>
              <th>강퇴/탈퇴 사유</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.member_id}>
                <td>{user.join_date}</td>
                <td>{user.update_date}</td>
                <td>{user.username}</td>
                <td>{user.realname}</td>
                <td>{user.nickname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{user.member_status}</td>
                <td>{user.member_kick_comment}</td>
                <td>
                    {user.member_status !== "정상" && (
                      <button onClick={() => handleRestore(user.member_id)}>복구</button>
                    )}
                    {user.member_status === "정상" && (
                      <button onClick={() => handleKick(user.member_id)}>강퇴</button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default ManageUser;