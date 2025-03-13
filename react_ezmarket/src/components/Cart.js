import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const getTokenFromCookie = () => {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('jwt_token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    };

    const fetchCart = async () => {
        try {
            const token = getTokenFromCookie();
            if (!token) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }
            const response = await axios.get("http://localhost:9090/api/cart/me", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setCartItems(response.data);
            setLoading(false);
        } catch (error) {
            setError("장바구니 불러오기 실패!");
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleIncreaseQuantity = (cartId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecreaseQuantity = (cartId) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.cartId === cartId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const handleRemoveItem = async (cartId) => {
        try {
            const token = getTokenFromCookie();
            if (!token) {
                setError("로그인이 필요합니다.");
                return;
            }

            console.log(`[삭제 요청] cartId: ${cartId}`);

            await axios.delete(`http://localhost:9090/api/cart/remove/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            console.log("[삭제 완료] 장바구니에서 제거됨");

            fetchCart();
        } catch (error) {
            console.error("[삭제 실패]", error.response?.data || error.message);
            setError("상품 삭제 실패!");
        }
    };

    const getTotalPrice = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.cartId))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (loading) return <div className="text-center mt-5">로딩 중...</div>;
    if (error) return <div className="text-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">장바구니</h2>
            {cartItems.length === 0 ? (
                <p className="text-center">장바구니가 비어 있습니다.</p>
            ) : (
                <div className="card p-3">
                    <div className="d-flex justify-content-between mb-3">
                        <input
                            type="checkbox"
                            checked={selectedItems.length === cartItems.length}
                            onChange={() => setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map((item) => item.cartId))}
                        />
                        <span>전체 선택</span>
                    </div>
                    {cartItems.map((item) => (
                        <div key={item.cartId} className="d-flex align-items-center border-bottom pb-3 mb-3">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.cartId)}
                                onChange={() => setSelectedItems((prev) =>
                                    prev.includes(item.cartId) ? prev.filter((id) => id !== item.cartId) : [...prev, item.cartId])
                                }
                            />
                            <img 
                                src={`http://localhost:9090/showimage?filename=${item.image}&obj=product`} 
                                alt={item.productName} 
                                className="mx-3 rounded" 
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                                <strong>{item.productName}</strong>
                                <p className="mb-0">{item.price.toLocaleString()}원</p>
                            </div>
                            <div>
                                <button className="btn btn-info btn-sm mx-1" onClick={() => handleDecreaseQuantity(item.cartId)}>-</button>
                                <span className="mx-2">{item.quantity}</span>
                                <button className="btn btn-info btn-sm mx-1" onClick={() => handleIncreaseQuantity(item.cartId)}>+</button>
                            </div>
                            <button className="btn btn-secondary btn-sm ms-3" onClick={() => handleRemoveItem(item.cartId)}>삭제</button>
                        </div>
                    ))}
                    <div className="text-end mt-3">
                        <h4>총 가격: {getTotalPrice().toLocaleString()} 원</h4>
                        <button 
    onClick={() => {
        const selectedCartItems = cartItems
            .filter(item => selectedItems.includes(item.cartId))
            .map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                totalPrice: item.price * item.quantity,
                productName: item.productName, 
                price: item.price,
                image: item.image
            }));

        navigate(`/buy/orderid`, { state: { selectedCartItems } });
    }}
    style={{ marginTop: '10px', padding: '10px 20px' }}
    className="btn btn-info mt-2"
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
