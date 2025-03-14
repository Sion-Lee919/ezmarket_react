import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/getallitemsforsearch`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            setError("상품 불러오기 실패!");
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">로딩 중...</div>;
    if (error) return <div className="text-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">상품 목록</h2>
            <div className="row">
                {products.map((product) => (
                    <div key={product.product_id} className="col-md-4 mb-4">
                        <div className="card">
                            <Link to={`/item/${product.product_id}`} className="text-decoration-none text-dark">
                                <img src={`${API_BASE_URL}/showimage?filename=${product.image_url}`} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">{product.price.toLocaleString()}원</p>
                                </div>
                            </Link>
                            <div className="card-footer text-center">
                                <button className="btn btn-info">장바구니에 추가</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
