import { Link } from "react-router-dom";
import { SearchComponent } from "./SearchComponent";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const HeaderComponent = () => {
    const brandid = 1;
    // const [user, setUser] = useState({
    //     member_id: '',
    //     username: '',
    //     realname: '',
    //     phone: '',
    //     email: '',
    //     address: ''
    //   });

    // useEffect(() => {
    //     axios.get('/userinfo')  
    //       .then(response => {
    //         setUser(response.data);
    //       })
    //       .catch(error => {
    //         console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
    //       });
    //   }, []);

    return (
    <div>
        <Link to="/">이지마켓</Link><br/>
        <Link to="/cart">장바구니</Link><br/>
        <Link to={`/brand/${brandid}`}>판매자페이지</Link>

        <SearchComponent></SearchComponent>

    </div>
    )
}

export default HeaderComponent;