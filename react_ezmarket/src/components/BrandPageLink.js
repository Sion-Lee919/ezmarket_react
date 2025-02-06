import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const BrandPageLink = () => {
    const [brandid, setBrandid] = useState(useParams());
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
            axios.get('http://localhost:9090/userinfo', { 
                headers: { 'Authorization': `Bearer ${token}` }, 
                withCredentials: true 
            })
            .then(response => {
                setBrandid(parseInt(response.data.member_id));
            })
            .catch(error => {
                console.error('사용자 정보를 가져오는 데 실패.', error);
            });
        } else {
            // Link 를 비활성화 및 안보이게 설정
        }
    }, [navigate]);

    return (
        <div>
            <Link to={`/brand/${brandid}`}>판매자페이지</Link>
        </div>
    );
};

export default BrandPageLink;
