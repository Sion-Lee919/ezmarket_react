import React, { useState, useEffect } from "react";
import $ from "jquery";
import Cookies from 'js-cookie';
import axios from "axios";


const Cart = () => {
    const token = Cookies.get('jwt_token');
    const [cartItems, setCartItems] = useState([]);
    const [memberId, setMemberId] = useState();

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
            axios.get('http://localhost:9090/userinfo', { 
                headers: { 'Authorization': `Bearer ${token}` }, 
                withCredentials: true 
            })
            .then(response => {
                setMemberId(parseInt(response.data.member_id));
            })
            .catch(error => {
                console.error('사용자 정보를 가져오는 데 실패.', error);
            });
        }

        if (memberId) {
            fetchCart();
        }
    }, [memberId]);

    const fetchCart = () => {
        $.ajax({
            url: `http://localhost:9090/api/cart/${memberId}`,
            type: "GET",
            success: function (data) {
                setCartItems(data);
            },
            error: function (error) {
                console.error("장바구니 불러오기 실패!", error);
            },
        });
    };

    const removeFromCart = (cartId) => {
        $.ajax({
            url: `http://localhost:9090/api/cart/remove/${cartId}`,
            type: "DELETE",
            success: function () {
                fetchCart();
            },
            error: function (xhr, status, error) {
                console.error("장바구니 삭제 실패!", error);
            },
        });
    };

    return (
        <div>
            {memberId ? (
                <>
                    <h2>장바구니</h2>
                    <h3>사용자id:{memberId}</h3>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.cartId}>
                                {item.productName} - {item.quantity}개
                                <button onClick={() => removeFromCart(item.cartId)}>삭제</button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>로그인 후 장바구니 이용 가능합니다.</p>
            )}
        </div>
    );
};

export default Cart;
