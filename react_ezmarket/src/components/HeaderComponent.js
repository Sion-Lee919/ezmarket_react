import { Link } from "react-router-dom";
import { SearchComponent } from "./SearchComponent";
import BrandPageLink from "./BrandPageLink";
import CategoryComponent from "./CategoryComponent";

const HeaderComponent = () => {

    return (
    <div>
        <Link to="/">이지마켓</Link><CategoryComponent></CategoryComponent>
        <Link to="/cart">장바구니</Link><br/>
        <BrandPageLink></BrandPageLink>
        <SearchComponent></SearchComponent>

    </div>
    )
}

export default HeaderComponent;