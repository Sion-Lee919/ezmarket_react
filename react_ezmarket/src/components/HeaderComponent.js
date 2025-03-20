import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import HeaderCategory from "./HeaderCategory";
import "../styles/HeaderComponent.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const HeaderComponent = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        const token = Cookies.get("jwt_token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        Cookies.remove("jwt_token");
        alert("로그아웃 되었습니다.");
        navigate("/");
        window.location.reload();
    };

    const handleMyPageClick = () => {
        navigate("/my");
    };

    const handleSignupClick = () => {
        navigate("/join");
    };

    const handleCartClick = () => {
        navigate("/cart");
    };

  return (
    <>
    <header className="py-1 border-bottom bg-white fixed-top" >
      <div className="container d-flex align-items-center justify-content-between px-2">
                <Link to="/" className="col-auto me-2">
                    <img
                        src={`${API_BASE_URL}/showimage?filename=ezmarketlogo.png&obj=brand`}
                         alt="EzMarket Logo"
                        style={{ height: "70px" }}
                    />
                </Link>

                <div className="d-flex gap-1 ms-1">
                    <HeaderCategory text="전통주 종류" />
                    <HeaderCategory text="지역" />
                </div>

                <div className="flex-grow-1 d-flex justify-content-center ms-4">
                    <SearchComponent />
                </div>

        <div className="d-flex align-items-center ms-4 header-buttons">
          {isLoggedIn ? (
            <>
              <button className="btn custom-outline-primary px-3 me-1" onClick={handleCartClick}>
                장바구니
              </button>
              <button className="btn custom-outline-primary px-3 me-1" onClick={handleLogout}>
                로그아웃
              </button>
              <button className="btn custom-outline-primary px-3" onClick={handleMyPageClick}>
                내 정보
              </button>
            </>
          ) : (
            <>
              <button className="btn custom-outline-primary px-3 me-1" onClick={handleCartClick}>
                장바구니
              </button>
              <button className="btn custom-outline-primary px-3 me-1" onClick={handleLoginClick}>
                로그인
              </button>
              <button className="btn custom-outline-primary px-3" onClick={handleSignupClick}>
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      <div className="recommend-tags-container">
        <div className="container d-flex justify-content-center">
          <Link to="/items?carbonations=5" className="recommend-tag">#톡 쏘는 강한 탄산</Link>
          <Link to="/items?bodys=5" className="recommend-tag">#묵직한 바디감</Link>
          <Link to="/items?sweetnesss=1" className="recommend-tag">#달지 않은 깔끔함</Link>
          <Link to="/items?sournesss=4&sournesss=5" className="recommend-tag">#새콤한 맛이 매력적</Link>
          <Link to="/items?sortType=popular" className="recommend-tag">#요즘 인기 있는 전통주</Link>
          <Link to="/items?sortType=popular&regions=제주" className="recommend-tag">#지금 가장 핫한 제주도의 전통주</Link>
        </div>
      </div>

    </header>
    <div style={{ height: "130px" }} aria-hidden="true" role="presentation"></div>

    </>
    
  );
  
  
  

};

export default HeaderComponent;
