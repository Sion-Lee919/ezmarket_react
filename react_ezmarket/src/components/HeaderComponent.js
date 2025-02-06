import { Link } from "react-router-dom";
import { SearchComponent } from "./SearchComponent";
import Cookies from 'js-cookie';
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import BrandPageLink from "./BrandPageLink";

const HeaderComponent = () => {

    return (
    <div>
        <Link to="/">이지마켓</Link><br/>
        <Link to="/cart">장바구니</Link><br/>
        <BrandPageLink></BrandPageLink>
        <SearchComponent></SearchComponent>

    </div>
    )
}

export default HeaderComponent;