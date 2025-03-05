import { useRef, useState, useEffect } from 'react';
import * as StompJs from '@stomp/stompjs';
import axios from "axios";
import Cookies from 'js-cookie';

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
      const response = await axios.get(`http://localhost:9090/chat/records`, {
        params: { channelId },
      });
      setChatList(response.data);  // DB에서 가져온 채팅 기록을 상태에 저장
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://localhost:9090/ws',
      onConnect: () => {
        subscribe();
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket closed:', event);
      }
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

    setChat('');
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
      axios.get('http://localhost:9090/userinfo', { 
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      })
      .then(response => {
        setMemberId(response.data.member_id);
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // This useEffect will ensure that channel is set correctly after memberId and product_id are set
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
  }, [channel]); // channel 값이 바뀔 때마다 connect가 실행됩니다.
  

  return (
    <div>
      <div className={'chat-list'}>
        {chatList.map((chatMessage, index) => (
          <div key={index}>
            <strong>{chatMessage.writer_id}:</strong> {chatMessage.chat}
          </div>
        ))}
      </div>
      <h1>{channel}</h1>
      <form onSubmit={(event) => handleSubmit(event, chat)}>
        <div>
          <input type={'text'} name={'chatInput'} onChange={handleChange} value={chat} />
        </div>
        <input type={'submit'} value={'의견 보내기'} />
      </form>
    </div>
  );
};

export default QnAChatComponent;