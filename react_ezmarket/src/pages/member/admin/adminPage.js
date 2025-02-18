import { useNavigate } from 'react-router-dom';

const AdminPage = () => {

    const navigate = useNavigate();

    const handleUserManageClick = () => {
        navigate('/admin/user');  
    };

    const handleSellerManageClick = () => {
        navigate('/admin/seller');  
    };

    return (
        <div>
            <button onClick={handleUserManageClick}>회원 관리</button>
            <button onClick={handleSellerManageClick}>판매자 관리</button>
        </div>
    );
};

export default AdminPage;