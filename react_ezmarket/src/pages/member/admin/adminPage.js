import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from 'axios';
import MyPageSideBar from '../my/myPageSideBar';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const AdminPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
                Cookies.remove('jwt_token');  
                navigate('/login');
            });
        } else {
            navigate('/login');  
        }
    }, [navigate]);

    const handleUserManageClick = () => {
        navigate('/my/admin/user');  
    };

    const handleSellerManageClick = () => {
        navigate('/my/admin/seller');  
    };

    const handleMoneyManageClick = () => {
        navigate('/my/admin/money_manage');  
    };

    return (
        <div className="mypage-form">
            <MyPageSideBar></MyPageSideBar>
            <div className="mypage-info">
                <div className="admin-select">
                    <button className="admin-select-button" onClick={handleUserManageClick}>회원 관리</button>
                    <button className="admin-select-button" onClick={handleSellerManageClick}>판매자 관리</button>
                    <button className="admin-select-button" onClick={handleMoneyManageClick}>정산 관리</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;