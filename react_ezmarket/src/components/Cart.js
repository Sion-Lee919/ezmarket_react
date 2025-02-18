import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const getTokenFromCookie = () => {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('jwt_token='));
        if (tokenCookie) {
            return tokenCookie.split('=')[1];
        }
        return null;
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = getTokenFromCookie();
            console.log("Token from cookie:", token);

            if (!token) {
                setError("로그인이 필요합니다.");
                return;
            }

            const response = await axios.get("http://localhost:9090/api/cart/me", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            setCartItems(response.data);
        } catch (error) {
            console.error("Cart error:", error.response?.data || error.message);
            setError("장바구니 불러오기 실패!");
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            const token = getTokenFromCookie();
            if (!token) return;

            await axios.delete(`http://localhost:9090/api/cart/remove/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            fetchCart();
        } catch (error) {
            console.error("장바구니 삭제 실패!", error.response?.data || error.message);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const token = getTokenFromCookie();
            if (!token) return;

            await axios.put(
                `http://localhost:9090/api/cart/update/${cartId}`, 
                { quantity: newQuantity },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json" 
                    },
                    withCredentials: true
                }
            );

            fetchCart();
        } catch (error) {
            console.error("수량 업데이트 실패!", error.response?.data || error.message);
        }
    };

    const handleSelectItem = (cartId) => {
        setSelectedItems((prev) =>
            prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map((item) => item.cartId));
        }
    };

    const getTotalPrice = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.cartId))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>장바구니</h2>
            {cartItems.length === 0 ? (
                <p>장바구니가 비어 있습니다.</p>
            ) : (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="checkbox"
                            checked={selectedItems.length === cartItems.length}
                            onChange={handleSelectAll}
                        /> 전체 선택
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cartItems.map((item) => (
                            <li key={item.cartId} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.cartId)}
                                    onChange={() => handleSelectItem(item.cartId)}
                                />
                                <img 
                                    src={`http://localhost:9090/showimage?filename=${item.image}`}
                                    alt={item.productName} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', margin: '0 10px' }}
                                />
                                <span>{item.productName}</span>
                                <span style={{ margin: '0 10px' }}>{item.price.toLocaleString()}원</span>
                                <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>-</button>
                                <span style={{ margin: '0 10px' }}>{item.quantity}개</span>
                                <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                                <button 
                                    onClick={() => removeFromCart(item.cartId)}
                                    style={{ marginLeft: '10px', color: 'red' }}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <h3>총 가격: {getTotalPrice().toLocaleString()} 원</h3>
                        <button 
                            onClick={() => alert("결제 페이지로 이동")}
                            style={{ marginTop: '10px', padding: '10px 20px' }}
                        >
                            결제하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
