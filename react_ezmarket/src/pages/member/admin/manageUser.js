import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import MyPageSideBar from '../my/myPageSideBar';

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
    <div className="mypage-form">
      <MyPageSideBar></MyPageSideBar>
      <div className="mypage-info"> 
        <div className="manage-table">
          <table border="1" style={{ borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%', border: '1px solid rgb(209, 198, 198)'}}>
            <thead>
              <tr>
                <th style={{width:'6%'}}>권한</th>
                <th style={{width:'10%'}}>가입 날짜</th>
                <th style={{width:'10%'}}>수정 날짜</th>
                <th style={{width:'8%'}}>ID</th>
                <th style={{width:'8%'}}>이름</th>
                <th style={{width:'8%'}}>닉네임</th>
                <th style={{width:'10%'}}>이메일</th>
                <th style={{width:'9%'}}>전화번호</th>
                <th style={{width:'10%'}}>주소</th>
                <th style={{width:'5%'}}>회원 상태</th>
                <th style={{width:'10%'}}>강/탈퇴 사유</th>
                <th style={{width:'6%'}}></th>
              </tr>
            </thead>
            <tbody style={{height: '350px'}}>
              {allUsers.map((user) => (
                <tr key={user.member_id}>
                  <td>{user.userauthor === 0 ? '관리자' : user.userauthor === 2 ? '판매자' : '구매자'}</td>
                  <td>{user.join_date}</td>
                  <td>{user.update_date}</td>
                  <td style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em', whiteSpace: 'nowrap'}}>{user.username}</td>
                  <td>{user.realname}</td>
                  <td style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em'}}>{user.nickname}</td>
                  <td style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em'}}>{user.email}</td>
                  <td>{user.phone}</td>
                  <td style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em'}}>{user.address}</td>
                  <td>{user.member_status}</td>
                  <td style={{maxHeight: '3em', overflow: 'auto', lineHeight: '1.5em'}}>{user.member_kick_comment}</td>
                  <td>
                      {user.member_status !== "정상" && (
                        <button className="positive-button" onClick={() => handleRestore(user.member_id)}>복구</button>
                      )}
                      {user.member_status === "정상" && (
                        <button className="negative-button" onClick={() => handleKick(user.member_id)}>강퇴</button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;