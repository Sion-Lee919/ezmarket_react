import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import Cookies from 'js-cookie';
import BrandPageLink from "./BrandPageLink";
import "../styles/BrandHeader.css";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const BrandHeader = () => {
  const query = useQuery();
  const brand_id = query.get("brand_id"); 
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
          setIsLoggedIn(true);  
        }
      }, []);

      const handleLoginClick = () => {
        navigate('/login');  
      };

    const handleLogout = () => {
        Cookies.remove('jwt_token'); 
        alert('로그아웃 되었습니다.');
        navigate('/login');
        window.location.reload();
      }

    const handleMyPageClick = () => {
        navigate('/my');  
    };

    const handleSignupClick = () => {
      navigate("/join");
    };

    const handleCartClick = () => {
      navigate("/cart");
    };

    return (
      <>
        <header className="border-bottom bg-white fixed-top">
            <div className="border-bottom container-fluid d-flex align-items-center justify-content-between px-4">
              <Link to="/" className="col-auto me-2">
                <img
                  src={`http://localhost:9090/showimage?filename=ezmarketlogo.png&obj=brand`}
                  alt="EzMarket Logo"
                  style={{ height: "40px" }}
                />
              </Link>
    
              <div className="d-flex align-items-center ms-4">
                  <button className="btn btn-outline-secondary px-3 me-1" onClick={handleCartClick}>
                    장바구니
                  </button>
                {isLoggedIn ? (
                  <>
                    <button className="btn btn-outline-danger px-3 me-1" onClick={handleLogout}>
                      로그아웃
                    </button>
                    <button className="btn btn-primary px-3" onClick={handleMyPageClick}>
                      내 정보
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-outline-primary px-3 me-1" onClick={handleLoginClick}>
                      로그인
                    </button>
                    <button className="btn btn-primary px-3" onClick={handleSignupClick}>
                      회원가입
                    </button>
                  </>
                    )}
                </div>
            </div>
        
        <div className={`brand-banner brand-${brand_id} d-flex justify-content-center border-bottom`} >
          <img 
            src={`http://localhost:9090/showimage?filename=logo${brand_id}.png&obj=brand`} 
            alt="Brand Logo" 
            className="img-fluid"
            style={{ maxHeight: "80px", cursor: "pointer" }}
            onClick={() => navigate(`/brandItems?brand_id=${brand_id}`)}
          />
        </div>
        </header>
        <div style={{ height: "140px" }} aria-hidden="true" role="presentation"></div>
      </>
    )
};

export default BrandHeader;