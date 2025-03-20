import { useRef, useState, useEffect } from 'react';
import * as StompJs from '@stomp/stompjs';
import axios from "axios";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";
const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_URL || "ws:http://13.208.47.23:8911/api";
const BASE_URL = process.env.REACT_APP_URL || "http://13.208.47.23:8911";


const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  chatList: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '400px',
    overflowY: 'auto',
    borderBottom: '1px solid #ccc',
    paddingRight: '10px',
    marginBottom: '15px',
  },
  chatItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    width: '46%',
    wordWrap: 'break-word',
    fontSize: '26px',
    fontFamily: 'Arial, sans-serif',
  },
  chatItemMine: {
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    marginLeft: 'auto',
  },
  chatItemOther: {
    justifyContent: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  chatContent: {
    maxWidth: '100%',
  },
  timestamp: {
    fontSize: '14px',
    color: '#888',
    textAlign: 'right',
    marginTop: '5px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    padding: '12px',
    flex: 1,
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '18px',
  },
  sendButton: {
    padding: '12px 18px',
    backgroundColor: '#189fdb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s',
  },
  sendButtonHover: {
    backgroundColor: '#1694c9',
  },
};

const QnAChatComponent = (props) => {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [channel, setChannel] = useState('');
  const product_id = props.product?.product_id;
  const brand_id = props.product?.brand_id;
  const isSeller = props.isSeller;
  const selectedMemberId = props.memberId;

  const client = useRef({});

  const fetchChatHistory = async (channelId) => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/records`, {
        params: { channelId },
      });
      setChatList(response.data);  // DB에서 가져온 채팅 기록을 상태에 저장
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: `${WEBSOCKET_BASE_URL}/ws`,
      onConnect: () => {
        subscribe();
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket closed:', event);
      },
    });
    client.current.activate();
  };

  const publish = (chat) => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: '/pub/chat',
      body: JSON.stringify({
        channel_id: channel,
        writer_id: memberId,
        product_id: product_id,
        member_id: isSeller ? props.memberId : memberId,
        chat: chat,
      }),
    });

    setChat(''); // 채팅 입력 창 초기화
  };

  const subscribe = () => {
    if (channel) {
      client.current.subscribe('/sub/chat/' + channel, (body) => {
        const json_body = JSON.parse(body.body);
        setChatList((_chat_list) => {
          return [..._chat_list, json_body];
        });
      });
    }
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleChange = (event) => {
    setChat(event.target.value);
  };

  const handleSubmit = (event, chat) => {
    event.preventDefault();
    publish(chat);
  };

  useEffect(() => {
    const token = Cookies.get('jwt_token');
    if (token) {
      setIsLoggedIn(true);
      axios.get(`${API_BASE_URL}/userinfo`, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      }).then(response => {
        setMemberId(response.data.member_id);
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (memberId && product_id) {
      const newChannel = isSeller
        ? `${product_id}${selectedMemberId}${brand_id}`
        : `${product_id}${memberId}${brand_id}`;
      setChannel(newChannel);
      fetchChatHistory(newChannel);  // 채팅 기록 API 호출
    }
  }, [memberId, product_id, selectedMemberId, isSeller, brand_id]);

  useEffect(() => {
    if (channel) {
      setChatList([]);
      connect(); // connect 호출
      return () => disconnect(); // 클린업
    }
  }, [channel]);

  useEffect(() => {
    const chatListContainer = document.getElementById('chatList');
    if (chatListContainer) {
      chatListContainer.scrollTop = chatListContainer.scrollHeight;  // 맨 아래로 스크롤 이동
    }
  }, [chatList]);

  const getChatWriter = (chatMessage) => {
    if (chatMessage.writer_id === memberId) {
      return '나';  // 본인이 보낸 메시지
    } else {
      return chatMessage.writernickname || '상대방';  // 상대방 메시지, 별명이 없으면 "상대방"
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div style={style.container}>
      <div style={style.chatList} id="chatList">
        {chatList.map((chatMessage, index) => (
          <div
            key={index}
            style={{
              ...style.chatItem,
              ...(chatMessage.writer_id === memberId
                ? style.chatItemMine
                : style.chatItemOther),
            }}
          >
            <div style={style.chatContent}>
              <strong>{getChatWriter(chatMessage)}</strong><br /><br />
              {chatMessage.chat}
              <div style={style.timestamp}>
                {formatDate(chatMessage.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={style.inputContainer}>
        <input
          type={'text'}
          name={'chatInput'}
          onChange={handleChange}
          value={chat}
          style={style.input}
        />
        <button
          type={'submit'}
          onClick={(event) => handleSubmit(event, chat)}
          style={style.sendButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = style.sendButtonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = ''}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default QnAChatComponent;
