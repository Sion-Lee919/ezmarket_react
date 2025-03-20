import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";
const BASE_URL = process.env.REACT_APP_URL || "http://13.208.47.23:8911";

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
        const token = getTokenFromCookie();
        if (token) {
            try {
                const response = await axios.get(`${BASE_URL}/api/cart/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                const serverCart = response.data;
                const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                if (localCart.length > 0) {
                    const mergedCart = mergeCarts(serverCart, localCart);
                    await syncLocalCartToServer(mergedCart, token);
                    localStorage.removeItem('guestCart');
                    setCartItems(mergedCart);
                } else {
                    setCartItems(serverCart);
                }
                setLoading(false);
            } catch (error) {
                setError("장바구니 불러오기 실패!");
                setLoading(false);
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            setCartItems(localCart);
            setLoading(false);
        }
    };

    const mergeCarts = (serverCart, localCart) => {
        const merged = [...serverCart];
        localCart.forEach(localItem => {
            const existingItem = merged.find(item => item.productId === localItem.productId);
            if (existingItem) {
                existingItem.quantity += localItem.quantity;
            } else {
                merged.push(localItem);
            }
        });
        return merged;
    };

    const syncLocalCartToServer = async (mergedCart, token) => {
        try {
            for (const item of mergedCart) {
                await axios.post(
                    `${BASE_URL}/api/cart/add`,
                    null,
                    {
                        params: { productId: item.productId, quantity: item.quantity },
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    }
                );
            }
        } catch (error) {
            console.error("Failed to sync cart to server:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleIncreaseQuantity = (cartId) => {
        const token = getTokenFromCookie();
        if (token) {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            const updatedCart = cartItems.map(item =>
                item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartItems(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
    };

    const handleDecreaseQuantity = (cartId) => {
        const token = getTokenFromCookie();
        if (token) {
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.cartId === cartId && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            );
        } else {
            const updatedCart = cartItems.map(item =>
                item.cartId === cartId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            setCartItems(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
    };

    const handleRemoveItem = async (cartId) => {
        const token = getTokenFromCookie();
        if (token) {
            try {
                await axios.delete(`${BASE_URL}/api/cart/remove/${cartId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                fetchCart();
            } catch (error) {
                setError("상품 삭제 실패!");
            }
        } else {
            const updatedCart = cartItems.filter(item => item.cartId !== cartId);
            setCartItems(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
    };

    const getTotalPrice = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.cartId))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        const token = getTokenFromCookie();
        if (!token) {
            alert("구매하시려면 회원가입 및 로그인이 필요합니다.");
            navigate('/login', { state: { redirect: '/cart' } });
        } else {
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
        }
    };

    if (loading) return <div className="text-center mt-5">로딩 중...</div>;
    if (error) return <div className="text-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4" style={{ fontSize: '1.75rem' }}>장바구니</h2>
            {cartItems.length === 0 ? (
                <p className="text-center" style={{ fontSize: '1.5rem' }}>장바구니가 비어 있습니다.</p>
            ) : (
                <div className="card p-3">
                    <div className="d-flex justify-content-between mb-3">
                        <input
                            type="checkbox"
                            checked={selectedItems.length === cartItems.length}
                            onChange={() => setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map((item) => item.cartId))}
                        />
                        <span style={{ fontSize: '1.1rem' }}>전체 선택</span>
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
                                src={`${API_BASE_URL}/showimage?filename=${item.image}&obj=product`}
                                alt={item.productName}
                                className="mx-3 rounded"
                                style={{ width: '75px', height: '75px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                                <strong style={{ fontSize: '1.5rem' }}>{item.productName}</strong>
                                <p className="mb-0" style={{ fontSize: '1.3rem' }}>{item.price.toLocaleString()}원</p>
                            </div>
                            <div>
                                <button className="btn btn-info btn-sm mx-1" style={{ fontSize: '1.1rem' }} onClick={() => handleDecreaseQuantity(item.cartId)}>-</button>
                                <span className="mx-2" style={{ fontSize: '1.1rem' }}>{item.quantity}</span>
                                <button className="btn btn-info btn-sm mx-1" style={{ fontSize: '1.1rem' }} onClick={() => handleIncreaseQuantity(item.cartId)}>+</button>
                            </div>
                            <button className="btn btn-secondary btn-sm ms-3" style={{ fontSize: '1.1rem' }} onClick={() => handleRemoveItem(item.cartId)}>삭제</button>
                        </div>
                    ))}
                    <div className="text-end mt-3">
                        <h3 style={{ fontSize: '1.5rem' }}>총 가격: {getTotalPrice().toLocaleString()} 원</h3>
                        <button
                            onClick={handleCheckout}
                            style={{ marginTop: '10px', padding: '12px 22px', fontSize: '1.3rem' }}
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