import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const BrandPageLink = () => {
    const [memberid, setMemberid] = useState(useParams());
    const [brandid, setBrandid] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
            axios.get('http://localhost:9090/userinfo', { 
                headers: { 'Authorization': `Bearer ${token}` }, 
                withCredentials: true 
            })
            .then(response => {
                setMemberid(parseInt(response.data.member_id));
            })
            .catch(error => {
                console.error('사용자 정보를 가져오는 데 실패.', error);
            });
        } else {
            // Link 를 비활성화 및 안보이게 설정
        }
    }, [setMemberid]);

    const clickLink = () => {
        // memberid가 있을 때만 요청을 보내도록 처리
        if (memberid) {
            axios.get(`http://localhost:9090/brandinfo?memberid=${memberid}`)
                .then(response => {
                    setBrandid(response.data.brand_id);
                    // 요청이 성공하면 브랜드 페이지로 리디렉션
                    navigate(`/brand/${response.data.brand_id}`);
                })
                .catch(error => {
                    console.error('브랜드 정보를 가져오는 데 실패.', error);
                });
        }
    }

    return (
        <div>
        <button onClick={clickLink} disabled={!memberid}>판매자페이지</button> 
        </div>
    );
};

export default BrandPageLink;
