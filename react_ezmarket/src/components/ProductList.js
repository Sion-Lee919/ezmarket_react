import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getTokenFromCookie = () => {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('jwt_token='));
        if (tokenCookie) {
            return tokenCookie.split('=')[1];
        }
        return null;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:9090/getallitemsforsearch");
            setProducts(response.data);
        } catch (error) {
            setError("상품 불러오기 실패!");
            console.error("상품 불러오기 실패!", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (productId) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: prev[productId] ? prev[productId] + 1 : 1,
        }));
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: newQuantity,
        }));
    };

    const handleAddToCart = async () => {
        const token = getTokenFromCookie();
        if (!token) {
            alert("로그인 후 장바구니 이용 가능합니다.");
            return;
        }

        try {
            for (const productId in selectedProducts) {
                await axios.post(
                    `http://localhost:9090/api/cart/add`, 
                    null,
                    {
                        params: {
                            productId: productId,
                            quantity: selectedProducts[productId]
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true
                    }
                );
            }
            alert("장바구니 추가 성공!");
            setSelectedProducts({});
        } catch (error) {
            console.error("장바구니 추가 실패!", error.response?.data || error.message);
            alert(error.response?.data || "장바구니 추가 실패!");
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>상품 목록</h2>
            {products.length === 0 ? (
                <p>등록된 상품이 없습니다.</p>
            ) : (
                <div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {products.map((product) => (
                            <li key={product.product_id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                                {product.image_url && (
                                    <img
                                        src={`http://localhost:9090/showimage?filename=${product.image_url}`}
                                        alt={product.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                )}
                                <div>
                                    <h3>{product.name}</h3>
                                    <p>{product.price.toLocaleString()}원</p>
                                    <p>도수: {product.alcohol}%</p>
                                    <p>용량: {product.volume}</p>
                                    <p>재고: {product.stock_quantity}</p>
                                    {product.description && <p>설명: {product.description}</p>}
                                    <div style={{ marginTop: '10px' }}>
                                        <input
                                            type="checkbox"
                                            checked={!!selectedProducts[product.product_id]}
                                            onChange={() => handleSelect(product.product_id)}
                                        />
                                        {selectedProducts[product.product_id] && (
                                            <span style={{ marginLeft: '10px' }}>
                                                <button 
                                                    onClick={() => handleQuantityChange(product.product_id, selectedProducts[product.product_id] - 1)}
                                                    style={{ padding: '2px 8px' }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ margin: '0 10px' }}>
                                                    {selectedProducts[product.product_id]}
                                                </span>
                                                <button 
                                                    onClick={() => handleQuantityChange(product.product_id, selectedProducts[product.product_id] + 1)}
                                                    style={{ padding: '2px 8px' }}
                                                >
                                                    +
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {Object.keys(selectedProducts).length > 0 && (
                        <button 
                            onClick={handleAddToCart} 
                            style={{ 
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            장바구니 추가
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;
