import React, { useState, useEffect } from "react";
import $ from "jquery";

const Cart = ({ memberId }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
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
            error: function (xhr, status, error) {
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
