import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
const QnAChatComponent = () => {
    const [nickname, setNickname] = useState(''); // 닉네임 상태
    const [message, setMessage] = useState(''); // 메시지 상태
    const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 리스트
    const [websocket, setWebsocket] = useState(null); // 웹소켓 상태
    const [user, setUser] = useState({
        member_id: '',
        username: '',
        realname: '',
        nickname: '',
        phone: '',
        email: '',
        address: ''
    });
    

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        
        if (token) {
          axios.get('http://localhost:9090/userinfo', { 
            headers: { 'Authorization': `Bearer ${token}` }, 
            withCredentials: true
          })
          .then(response => {
            setUser(response.data);
            setNickname(user.nickname);
          })
          .catch(error => {
            alert(error.response.data.message);
            Cookies.remove('jwt_token');
          });
        } else {
          
        }
    }, [nickname]);

    useEffect(() => {
        // 컴포넌트가 처음 렌더링 될 때 웹소켓 연결을 초기화합니다.
        return () => {
            // 컴포넌트가 언마운트되면 웹소켓 연결 종료
            if (websocket) {
                websocket.close();
            }
        };
    }, [websocket]);

    const handleEnter = () => {
        const ws = new WebSocket("ws://localhost:9090/chatws");
        ws.onopen = () => {
            console.log("웹소켓 연결 성공");
            ws.send(`${nickname} 님이 대화방에 입장하셨습니다.`);
        };
        ws.onclose = () => {
            console.log("웹소켓 연결 종료");
            setChatMessages([]); // 채팅 내용 초기화
        };
        ws.onmessage = (event) => {
            console.log("서버로부터 메시지 수신 성공");
            setChatMessages(prevMessages => [...prevMessages, event.data]); // 서버로부터 받은 메시지 추가
        };
        setWebsocket(ws);
    };

    const handleExit = () => {
        if (websocket) {
            websocket.close(); // 웹소켓 연결 종료
        }
    };

    const handleSendMessage = () => {
        if (websocket && nickname && message) {
            websocket.send(`${nickname}: ${message}`);
            setMessage(''); // 메시지 전송 후 입력란 초기화
        }
    };

    return (
        <div>
            <div>
                <label>별명: </label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    id="nickname"
                />
            </div>
            <div>
                <button onClick={handleEnter} id="enterbtn">입장버튼</button>
                <button onClick={handleExit} id="exitbtn">퇴장버튼</button>
            </div>
            <h1>채팅영역</h1>
            <div
                id="chatmessagearea"
                style={{ backgroundColor: 'yellow', border: '2px solid black', padding: '10px' }}
            >
                {chatMessages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="내가 전송하려는 대화 입력"
                />
                <button onClick={handleSendMessage} id="sendbtn">대화전송</button>
            </div>
        </div>
    );
};

export default QnAChatComponent;
