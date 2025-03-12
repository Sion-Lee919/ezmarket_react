import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import HeaderCategory from "./HeaderCategory";
import "../styles/HeaderComponent.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

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

//  minsu_react
//     return (
//         <header className="py-1 border-bottom bg-white">
//             <div className="container-fluid d-flex align-items-center justify-content-between px-4">
//                 <Link to="/" className="col-auto me-2">
//                     <img
//                         src={`${API_BASE_URL}/showimage?filename=ezmarketlogo.png&obj=brand`}
//                         alt="EzMarket Logo"
//                         style={{ height: "70px" }}
//                     />
//                 </Link>

  return (
    <>
    <header className="py-1 border-bottom bg-white fixed-top" >
      <div className="container-fluid d-flex align-items-center justify-content-between px-4">


                <div className="d-flex gap-1 ms-1">
                    <HeaderCategory text="전통주 종류" />
                    <HeaderCategory text="지역" />
                </div>

                <div className="flex-grow-1 d-flex justify-content-center ms-4">
                    <SearchComponent />
                </div>


//                 <div className="ms-4">
//                     <button className="btn btn-outline-secondary px-3" onClick={handleCartClick}>
//                         장바구니
//                     </button>
//                 </div>

//                 <div className="d-flex align-items-center ms-4">
//                     {isLoggedIn ? (
//                         <>
//                             <button className="btn btn-outline-danger px-3 me-1" onClick={handleLogout}>
//                                 로그아웃
//                             </button>
//                             <button className="btn btn-primary px-3" onClick={handleMyPageClick}>
//                                 내 정보
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <button className="btn btn-outline-primary px-3 me-1" onClick={handleLoginClick}>
//                                 로그인
//                             </button>
//                             <button className="btn btn-primary px-3" onClick={handleSignupClick}>
//                                 회원가입
//                             </button>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );

        <div className="ms-4">
          <button className="btn custom-outline-primary px-3" onClick={handleCartClick}>
            장바구니
          </button>
        </div>

        <div className="d-flex align-items-center ms-4">
          {isLoggedIn ? (
            <>
              <button className="btn custom-outline-primary px-3 me-1" onClick={handleLogout}>
                로그아웃
              </button>
              <button className="btn custom-outline-primary px-3" onClick={handleMyPageClick}>
                내 정보
              </button>
            </>
          ) : (
            <>
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
    </header>
    <div style={{ height: "80px" }} aria-hidden="true" role="presentation"></div>
    </>
    
  );
  
  
  

};

export default HeaderComponent;
