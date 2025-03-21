import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsInfo, setProductsInfo] = useState({});
    const [user, setUser] = useState({
        member_id: '',
        username: '',
        realname: '',
        nickname: '',
        phone: '',
        email: '',
        address: '',
        userauthor: ''
      });
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

    const handleReturnOrder = async (orderId) => {
        const token = getTokenFromCookie();
        if (!token) {
            setError("로그인이 필요합니다.");
            return;
        }
        
        try {
            await axios.post(`${API_BASE_URL}/buy/return/${orderId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true
            });
            
            alert("반품 처리중입니다.");
            
            const updatedOrders = orders.map(order => {
                if (order.orderId === orderId) {
                    return { ...order, status: '반품중' };
                }
                return order;
            });
            
            setOrders(updatedOrders);
        } catch (error) {
            console.error("주문 반품 처리 실패:", error);
            alert("반품 처리 중 오류가 발생했습니다: " + (error.response?.data?.message || error.message));
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const token = getTokenFromCookie();
        if (!token) {
            setError("로그인이 필요합니다.");
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/buy/change/${id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true,
                params: { status: newStatus}
            });

            setOrders((prevOrders) => 
                prevOrders.map((order) => order.orderId === id ? {...order, status: newStatus} : order)
            )
            
        } catch (error) {
            console.error("주문 상태 처리 실패:", error);
            alert("주문 상태 중 오류가 발생했습니다: " + (error.response?.data?.message || error.message));
        }

    }

    useEffect(() => {
        const token = Cookies.get('jwt_token'); 
        
        if (token) {
          axios.get(`${API_BASE_URL}/userinfo`, { 
            headers: { 'Authorization': `Bearer ${token}` }, 
            withCredentials: true
          })
          .then(response => {
            setUser(response.data);
          })
          .catch(error => {
            alert(error.response.data.message);
            Cookies.remove('jwt_token');
            navigate('/login');
          });
        } else {
          navigate('/login');
        }
      }, [navigate]);

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
            <h2 className="text-center fw-bold mb-4">나의 주문 목록</h2>
            
            {orders.map((order, orderIndex) => {
                const productAmount = order.productInfo.reduce((sum, product) => sum + (product.price * product.quantity), 0);
                const finalAmount = order.totalAmount - (order.usedPoints || 0);

                return (
                    <div key={orderIndex} className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>주문번호: {order.orderId || "정보 없음"}                  
                                {user.userauthor == 2 &&(
                                    <select value={order.status} onChange={(e) => handleStatusChange(order.orderId, e.target.value)}>
                                        <option value="처리 중">처리 중</option>
                                        <option value="배송 중">배송 중</option>
                                        <option value="배송 완료">배송 완료</option>
                                        <option value="반품중">반품중</option>
                                    </select>
                                )}</span>
                            <span className={`badge ${
                                order.status === '처리 중' ? 'bg-warning' : 
                                order.status === '배송 중' ? 'bg-info' : 
                                order.status === '배송 완료' ? 'bg-success' : 
                                order.status === '반품중' ? 'bg-info' : 'bg-secondary'
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
                                            <td colSpan="3" className="text-end"><strong>상품 금액</strong></td>
                                            <td>{productAmount.toLocaleString()}원</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end"><strong>사용한 적립금</strong></td>
                                            <td>{(order.usedPoints || 0).toLocaleString()}원</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end"><strong>총 결제 금액</strong></td>
                                            <td><strong>{finalAmount.toLocaleString()}원</strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <h5>배송 정보</h5>
                                    <p><strong>받는 사람:</strong> {order.receiverName || '정보 없음'}</p>
                                    <p><strong>연락처:</strong> {order.receiverPhone || '정보 없음'}</p>
                                    <p><strong>이메일:</strong> {order.receiverEmail || '정보 없음'}</p>
                                    <p><strong>배송지:</strong> {order.shippingAddress || '정보 없음'}</p>
                                    <p><strong>배송 메시지:</strong> {order.shippingMessage || '정보 없음'}</p>
                                </div>
                                <div className="col-md-6">
                                    <h5>결제 정보</h5>
                                    <p><strong>결제 방법:</strong> {order.paymentMethod || '정보 없음'}</p>
                                </div>
                            </div>
                            
                            <div className="d-flex justify-content-end mt-4">
                                {order.status === '처리 중' && user.userauthor == 1 && (
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleReturnOrder(order.orderId)}
                                    >
                                        반품 신청
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            
            <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
                쇼핑 계속하기
            </button>
        </div>
    );
};

export default MyOrder;