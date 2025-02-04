import { Link } from "react-router-dom";
import { SearchComponent } from "./SearchComponent";

const HeaderComponent = (prop) => {
    return (
    <div>
        <Link to="/">이지마켓</Link><br/>
        <Link to="/cart">장바구니</Link>

        <Link to="/brand">판매자페이지</Link>


        <SearchComponent></SearchComponent>

    </div>
    )
}

export default HeaderComponent;