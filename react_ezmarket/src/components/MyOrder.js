import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsInfo, setProductsInfo] = useState({});
    const navigate = useNavigate();

    const getTokenFromCookie = () => {
        return Cookies.get('jwt_token') || null;
    };

    const fetchProductDetails = async (productId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/item/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`상품 ID ${productId} 정보 조회 실패:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const token = getTokenFromCookie();
            if (!token) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }
            
            try {
                console.log("주문 목록 API 호출 시도..."); 
                const response = await axios.get(
                    `${API_BASE_URL}/buy/my/order`, 
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        withCredentials: true
                    }
                );
                
                console.log("주문 목록 데이터:", response.data);
                
                if (!response.data || response.data.length === 0) {
                    console.log("주문 데이터가 없습니다.");
                    setOrders([]);
                    setLoading(false);
                    return;
                }
                
                // 주문 데이터 처리
                const processedOrders = response.data.map(order => {
                    try {
                        if (order.productInfo && typeof order.productInfo === 'string') {
                            try {
                                order.productInfo = JSON.parse(order.productInfo);
                            } catch (e) {
                                console.error("productInfo 파싱 실패:", e);
                                order.productInfo = [];
                            }
                        } else if (!order.productInfo) {
                            order.productInfo = [];
                        }
                        return order;
                    } catch (e) {
                        console.error(`주문 처리 중 오류:`, e);
                        return order;
                    }
                });
                
                setOrders(processedOrders);

                const allProductIds = new Set();
                processedOrders.forEach(order => {
                    if (Array.isArray(order.productInfo)) {
                        order.productInfo.forEach(product => {
                            if (product.productId) {
                                allProductIds.add(product.productId);
                            }
                        });
                    }
                });
                
                // 각 상품의 상세 정보 가져오기
                const productInfoMap = {};
                for (const productId of allProductIds) {
                    const productDetail = await fetchProductDetails(productId);
                    if (productDetail) {
                        productInfoMap[productId] = productDetail;
                    }
                }
                
                setProductsInfo(productInfoMap);
                setLoading(false);
            } catch (err) {
                console.error("주문 목록 불러오기 실패:", err);
                setError("주문 목록을 불러오지 못했습니다.");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">로딩 중...</p>
        </div>
    );
    
    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-primary" onClick={() => navigate("/login")}>
                    로그인 페이지로 이동
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mt-5">
                <h2>나의 주문 목록</h2>
                <div className="alert alert-info">
                    주문 내역이 없습니다.
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/")}>
                    쇼핑 계속하기
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">나의 주문 목록</h2>
            
            {orders.map((order, orderIndex) => (
                <div key={orderIndex} className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span>주문번호: {order.orderId || "정보 없음"}</span>
                        <span className={`badge ${
                            order.status === '처리 중' ? 'bg-warning' : 
                            order.status === '배송 중' ? 'bg-info' : 
                            order.status === '배송 완료' ? 'bg-success' : 'bg-secondary'
                        }`}>
                            {order.status || "상태 정보 없음"}
                        </span>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <strong>주문일:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString('ko-KR') : '정보 없음'}
                        </div>
                        
                        <div className="table-responsive mb-3">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>상품 정보</th>
                                        <th>수량</th>
                                        <th>가격</th>
                                        <th>합계</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(order.productInfo) && order.productInfo.length > 0 ? (
                                        order.productInfo.map((product, index) => {
                                            const productDetail = productsInfo[product.productId] || {};
                                            return (
                                                <tr key={index}>
                                                    <td className="d-flex align-items-center">
                                                        {productDetail.image_url && (
                                                            <img 
                                                                src={`${API_BASE_URL}/showimage?filename=${productDetail.image_url}&obj=product`} 
                                                                alt={productDetail.name || `상품 ${product.productId}`} 
                                                                className="me-3 rounded" 
                                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                        <div>
                                                            <div>{productDetail.name || `상품 ID: ${product.productId}`}</div>
                                                            {productDetail.brandname && <small className="text-muted">브랜드: {productDetail.brandname}</small>}
                                                        </div>
                                                    </td>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.price ? `${product.price.toLocaleString()}원` : '-'}</td>
                                                    <td>{product.price && product.quantity ? `${(product.price * product.quantity).toLocaleString()}원` : '-'}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">상품 정보가 없습니다</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end"><strong>총 결제금액</strong></td>
                                        <td><strong>{order.totalAmount ? `${order.totalAmount.toLocaleString()}원` : '0원'}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6">
                                <h5>배송 정보</h5>
                                <p><strong>받는 사람:</strong> {order.receiverName || '정보 없음'}</p>
                                <p><strong>연락처:</strong> {order.receiverPhone || '정보 없음'}</p>
                                <p><strong>배송지:</strong> {order.shippingAddress || '정보 없음'}</p>
                                <p><strong>배송 메시지:</strong> {order.shippingMessage || '정보 없음'}</p>
                            </div>
                            <div className="col-md-6">
                                <h5>결제 정보</h5>
                                <p><strong>결제 방법:</strong> {order.paymentMethod || '정보 없음'}</p>
                                <p><strong>결제 금액:</strong> {order.totalAmount ? `${order.totalAmount.toLocaleString()}원` : '0원'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
                쇼핑 계속하기
            </button>
        </div>
    );
};

export default MyOrder;