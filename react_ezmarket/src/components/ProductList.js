import React, { useState, useEffect } from "react";
import $ from "jquery";

const ProductList = ({ memberId }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        $.ajax({
            url: "http://localhost:9090/api/products",
            type: "GET",
            success: function (data) {
                setProducts(data);
            },
            error: function (xhr, status, error) {
                console.error("상품 불러오기 실패!", error);
            },
        });
    };

    const handleSelect = (productId) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [productId]: prev[productId] ? prev[productId] + 1 : 1,
        }));
    };

    const handleAddToCart = () => {
        if (!memberId) {
            alert("로그인 후 장바구니 이용 가능합니다.");
            return;
        }

        for (const productId in selectedProducts) {
            $.ajax({
                url: "http://localhost:9090/api/cart/add",
                type: "POST",
                data: { memberId, productId, quantity: selectedProducts[productId] },
                success: function () {
                    alert("장바구니 추가 성공!");
                },
                error: function (xhr, status, error) {
                    console.error("장바구니 추가 실패!", error);
                },
            });
        }
    };

    return (
        <div>
            <h2>상품 목록</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.productId}>
                        <input type="checkbox" onChange={() => handleSelect(product.productId)} />
                        {product.name} - {product.price}원
                    </li>
                ))}
            </ul>
            <button onClick={handleAddToCart}>장바구니 추가</button>
        </div>
    );
};

export default ProductList;
