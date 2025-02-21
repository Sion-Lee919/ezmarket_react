import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]); // 장바구니 목록
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태
    const [selectedItems, setSelectedItems] = useState([]); // 선택한 항목

    const getTokenFromCookie = () => {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('jwt_token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    };

    const fetchCart = async () => {
        try {
            const token = getTokenFromCookie();
            console.log("JWT 토큰 확인:", token);

            if (!token) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            console.log("[API 요청] 장바구니 불러오기 실행...");
            const response = await axios.get("http://localhost:9090/api/cart/me", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            console.log("[응답 성공] 장바구니 데이터:", response.data);
            setCartItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("장바구니 불러오기 실패", error.response?.data || error.message);
            setError("장바구니 불러오기 실패!");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeFromCart = async (cartId) => {
        try {
            const token = getTokenFromCookie();
            if (!token) return;

            console.log("[삭제 요청] cartId:", cartId);
            await axios.delete(`http://localhost:9090/api/cart/remove/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            console.log("[삭제 완료] 장바구니 상품 제거");
            fetchCart();
        } catch (error) {
            console.error("[삭제 실패]", error.response?.data || error.message);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const token = getTokenFromCookie();
            if (!token) return;

            console.log("[수량 변경] cartId:", cartId, "새 수량:", newQuantity);
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

            console.log("[수량 변경 완료] cartId:", cartId);
            fetchCart();
        } catch (error) {
            console.error("[수량 업데이트 실패]", error.response?.data || error.message);
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
                                    src={`http://localhost:9090/showimage?filename=${item.image}&obj=product`} 
                                    alt={item.productName} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', margin: '0 10px' }}
                                    onError={(e) => { 
                                        console.error("이미지 로드 실패:", item.image);
                                        e.target.src = "/default-image.png";
                                    }}
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
