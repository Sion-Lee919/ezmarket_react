import { Link } from "react-router-dom";
import { SearchComponent } from "./SearchComponent";
import BrandPageLink from "./BrandPageLink";
import CategoryComponent from "./CategoryComponent";
import { useNavigate } from 'react-router-dom'; 
import "../styles/HeaderComponent.css";

const HeaderComponent = () => {

    const navigate = useNavigate();  

    const handleMyPageClick = () => {
        navigate('/my');  
    };

    const handleLoginClick = () => {
        navigate('/login');  
    };

    return (
    <div className="header">
        <Link to="/">이지마켓</Link><CategoryComponent></CategoryComponent>
        <Link to="/cart">장바구니</Link><br/>
        <BrandPageLink></BrandPageLink>
        <SearchComponent></SearchComponent>
        <div>
      <button onClick={handleMyPageClick}>
        내 정보
      </button>

      <button onClick={handleLoginClick}>
        로그인
      </button>
    </div>
    </div>
    
    )
}

export default HeaderComponent;