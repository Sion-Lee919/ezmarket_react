import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const getTokenFromCookie = () => {
        return Cookies.get("jwt_token") || null;
    };

    useEffect(() => {
        fetchProducts();
        checkLoginStatus();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log("상품 목록 불러오기 시작...");
            const response = await axios.get("http://localhost:9090/getallitemsforsearch");

            console.log("상품 목록 불러오기 성공!", response.data);
            setProducts(response.data);
        } catch (error) {
            setError("상품 불러오기 실패!");
            console.error("상품 불러오기 실패!", error);
        } finally {
            setLoading(false);
        }
    };

    const checkLoginStatus = () => {
        const token = getTokenFromCookie();
        console.log("JWT 토큰 확인:", token);
        setIsLoggedIn(!!token);
    };

    const handleAddToCart = async (productId, quantity = 1) => {
        const token = getTokenFromCookie();
        if (!token) {
            alert("로그인 후 장바구니를 이용할 수 있습니다.");
            console.warn("장바구니 추가 실패 - 로그인 필요!");
            return;
        }

        console.log("장바구니 추가 버튼 클릭됨 - 상품 ID:", productId, "수량:", quantity);

        try {
            const response = await axios.post(
                "http://localhost:9090/api/cart/add",
                null,
                {
                    params: {
                        productId: productId,
                        quantity: quantity
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );

            console.log("장바구니 추가 성공! 응답 데이터:", response.data);
            alert("장바구니에 추가되었습니다!");
        } catch (error) {
            console.error("장바구니 추가 실패:", error.response?.data || error.message);
            alert(error.response?.data || "장바구니 추가 실패!");
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "20px" }}>상품 목록</h2>
            {products.length === 0 ? (
                <p>등록된 상품이 없습니다.</p>
            ) : (
                <div>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {products.map((product) => (
                            <li key={product.product_id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd" }}>
                                <Link to={`/item/${product.product_id}`} style={{ textDecoration: "none", color: "black" }}>
                                    {product.image_url && (
                                        <img
                                            src={`http://localhost:9090/showimage?filename=${product.image_url}`}
                                            alt={product.name}
                                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                        />
                                    )}
                                    <h3>{product.name}</h3>
                                </Link>
                                <p>{product.price.toLocaleString()}원</p>
                                <p>도수: {product.alcohol}%</p>
                                <p>용량: {product.volume}</p>
                                <p>재고: {product.stock_quantity}</p>

                                {isLoggedIn ? (
                                    <button 
                                        onClick={() => handleAddToCart(product.product_id)}
                                        style={{ 
                                            marginTop: "10px", 
                                            padding: "5px 10px", 
                                            backgroundColor: "#4CAF50", 
                                            color: "white", 
                                            border: "none", 
                                            borderRadius: "4px", 
                                            cursor: "pointer" 
                                        }}
                                    >
                                        장바구니에 추가
                                    </button>
                                ) : (
                                    <p style={{ color: "red", fontWeight: "bold" }}>로그인 후 구매 가능</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProductList;
