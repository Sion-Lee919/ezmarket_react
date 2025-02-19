import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from 'axios';

const AdminPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    //관리자가 아니면 리디렉션
    useEffect(() => {
        const token = Cookies.get('jwt_token');  

        if (token) {
            axios.get('http://localhost:9090/userinfo', { 
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

    const handleUserManageClick = () => {
        navigate('/my/admin/user');  
    };

    const handleSellerManageClick = () => {
        navigate('/my/admin/seller');  
    };

    return (
        <div>
            <button onClick={handleUserManageClick}>회원 관리</button>
            <button onClick={handleSellerManageClick}>판매자 관리</button>
        </div>
    );
};

export default AdminPage;