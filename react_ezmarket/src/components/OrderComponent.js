import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { addressData } from "../values/address.value";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const provinces = Object.keys(addressData);

const OrderComponent = () => {
    const location = useLocation();
    const selectedCartItems = location.state?.selectedCartItems || [];
    const navigate = useNavigate();

    const [shippingMessage, setShippingMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("무통장입금");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [receiverEmail, setReceiverEmail] = useState("");
    const [memberPoints, setMemberPoints] = useState(0);
    const [usedPoints, setUsedPoints] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [userInfo, setUserInfo] = useState(null);

    const districts = selectedProvince ? addressData[selectedProvince] : [];

    const handleProvinceChange = (e) => {
        setSelectedProvince(e.target.value);
        setSelectedDistrict("");
    };

    const getTokenFromCookie = () => {
        return Cookies.get('jwt_token') || null;
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = getTokenFromCookie();
            if (token) {
                try {
                    const response = await axios.get("http://localhost:9090/userinfo", {
                        headers: { 'Authorization': `Bearer ${token}` },
                        withCredentials: true
                    });
                    
                    setUserInfo(response.data);
                    setMemberPoints(Number(response.data.points) || 0);
                    
                    // Pre-fill shipping information from user data
                    if (response.data.realname) {
                        setReceiverName(response.data.realname);
                    }
                    
                    if (response.data.phone) {
                        setReceiverPhone(response.data.phone);
                    }
                    
                    if (response.data.email) {
                        setReceiverEmail(response.data.email);
                    }
                    
                    // Handle address parsing if available
                    if (response.data.address) {
                        parseAndSetAddress(response.data.address);
                    }
                    
                } catch (error) {
                    console.error("회원 정보를 불러오지 못했습니다:", error);
                    alert("회원 정보를 불러오지 못했습니다.");
                }
            }
        };
        
        fetchUserInfo();
    }, []);
    
    // Function to parse address into province, district, and detail
    const parseAndSetAddress = (fullAddress) => {
        if (!fullAddress) return;
        
        try {
            let foundProvince = "";
            let foundDistrict = "";
            
            // Find matching province in the address
            for (const province of provinces) {
                if (fullAddress.includes(province)) {
                    foundProvince = province;
                    setSelectedProvince(province);
                    
                    // Find matching district in the address
                    const districtsInProvince = addressData[province];
                    for (const district of districtsInProvince) {
                        if (fullAddress.includes(district)) {
                            foundDistrict = district;
                            setSelectedDistrict(district);
                            break;
                        }
                    }
                    break;
                }
            }
            
            // Set detail address by removing province and district
            if (foundProvince && foundDistrict) {
                let detail = fullAddress.replace(foundProvince, "").replace(foundDistrict, "").trim();
                setDetailAddress(detail);
            } else {
                // If parsing fails, just set the whole thing as detail address
                setDetailAddress(fullAddress);
            }
        } catch (error) {
            console.error("주소 파싱 중 오류 발생:", error);
            setDetailAddress(fullAddress);
        }
    };

    useEffect(() => {
        const total = selectedCartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    }, [selectedCartItems]);

    const handleUsedPointsChange = (e) => {
        const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), memberPoints);
        const maxUsablePoints = Math.min(memberPoints, totalAmount);
        setUsedPoints(Math.min(value, maxUsablePoints));
    };

    const handleOrderSubmit = async () => {
        if (!receiverName) {
            alert("받는 사람을 입력해주세요.");
            return;
        }
        if (!selectedProvince || !selectedDistrict || !detailAddress) {
            alert("주소를 모두 입력해주세요.");
            return;
        }
        if (!receiverPhone) {
            alert("휴대전화를 입력해주세요.");
            return;
        }
        const token = getTokenFromCookie();
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        if (selectedCartItems.length === 0) {
            alert("선택된 상품이 없습니다.");
            navigate("/cart");
            return;
        }

        const fullAddress = `${selectedProvince} ${selectedDistrict} ${detailAddress}`;
        const orderData = {
            shippingAddress: fullAddress,
            shippingMessage,
            paymentMethod,
            receiverName,
            receiverPhone,
            receiverEmail,
            productInfo: selectedCartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            usedPoints: Number(usedPoints),
        };

        try {
            const response = await axios.post(

                `${API_BASE_URL}/buy/orderid`, 

                orderData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );
            console.log("주문 성공:", response.data);
            alert("주문이 완료되었습니다.");
            navigate("/my/order");
        } catch (error) {
            console.error("주문 실패 오류:", error);
            if (error.response) {
                alert(`주문에 실패했습니다. 오류 코드: ${error.response.status}, 메시지: ${error.response.data || '알 수 없는 오류'}`);
            } else if (error.request) {
                alert("서버에서 응답이 없습니다. 서버가 실행 중인지 확인해주세요.");
            } else {
                alert(`요청 중 오류가 발생했습니다: ${error.message}`);
            }
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 11) {
            let formattedValue = value;
            if (value.length > 3 && value.length <= 7) {
                formattedValue = value.replace(/(\d{3})(\d+)/, '$1-$2');
            } else if (value.length > 7) {
                formattedValue = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
            }
            setReceiverPhone(formattedValue);
        }
    };

    const remainingAmount = totalAmount - usedPoints;

    return (
        <div className="container mt-5">
            <h2>주문서 작성</h2>
            {selectedCartItems.length === 0 ? (
                <div className="alert alert-warning">
                    선택된 상품이 없습니다.
                    <button className="btn btn-link" onClick={() => navigate("/cart")}>
                        장바구니로 돌아가기
                    </button>
                </div>
            ) : (
                <>
                    <div className="card mb-4">
                        <div className="card-header">주문 상품 목록</div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>상품 이미지</th>
                                        <th>상품명</th>
                                        <th>수량</th>
                                        <th>단가</th>
                                        <th>금액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCartItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>

                                                <img 
                                                    src={`${API_BASE_URL}/showimage?filename=${item.image}&obj=product`} 
                                                    alt={item.productName || '상품 이미지'} 
                                                    className="rounded" 

                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td>{item.productName || `상품 ID: ${item.productId}`}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price ? item.price.toLocaleString() : (item.totalPrice / item.quantity).toLocaleString()}원</td>
                                            <td>{item.totalPrice.toLocaleString()}원</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className="text-end"><strong>총 결제 금액:</strong></td>
                                        <td>
                                            <strong>{totalAmount.toLocaleString()}원</strong>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">적립금 사용</div>
                        <div className="card-body">
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">보유 적립금</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={`${memberPoints.toLocaleString()}점`}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">사용할 적립금</label>
                                <div className="col-sm-10">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={usedPoints}
                                        onChange={handleUsedPointsChange}
                                        min="0"
                                        max={Math.min(memberPoints, totalAmount)}
                                        placeholder="사용할 적립금을 입력하세요"
                                    />
                                    <small className="text-muted">최대 사용 가능 적립금: {Math.min(memberPoints, totalAmount).toLocaleString()}점</small>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">최종 결제 금액</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={`${remainingAmount.toLocaleString()}원`}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">배송 정보</div>
                        <div className="card-body">
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">받는 사람 <span className="text-danger">*</span></label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={receiverName}
                                        onChange={(e) => setReceiverName(e.target.value)}
                                        placeholder="받는 사람 이름을 입력해주세요"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">주소 <span className="text-danger">*</span></label>
                                <div className="col-sm-10">
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <select
                                                className="form-select"
                                                value={selectedProvince}
                                                onChange={handleProvinceChange}
                                                required
                                            >
                                                <option value="">시/도 선택</option>
                                                {provinces.map(province => (
                                                    <option key={province} value={province}>{province}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <select
                                                className="form-select"
                                                value={selectedDistrict}
                                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                                disabled={!selectedProvince}
                                                required
                                            >
                                                <option value="">시/군/구 선택</option>
                                                {districts.map(district => (
                                                    <option key={district} value={district}>{district}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={detailAddress}
                                        onChange={(e) => setDetailAddress(e.target.value)}
                                        placeholder="상세 주소를 입력해주세요 (예: 도로명, 건물명, 동, 호수 등)"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">휴대전화 <span className="text-danger">*</span></label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={receiverPhone}
                                        onChange={handlePhoneChange}
                                        placeholder="휴대전화 번호를 입력해주세요 (예: 010-1234-5678)"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">이메일 <span className="text-danger">*</span></label>
                                <div className="col-sm-10">
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={receiverEmail}
                                        onChange={(e) => setReceiverEmail(e.target.value)}
                                        placeholder="이메일을 입력해주세요"
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">배송 메시지</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        value={shippingMessage}
                                        onChange={(e) => setShippingMessage(e.target.value)}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="배송 전에 미리 연락바랍니다">배송 전에 미리 연락바랍니다</option>
                                        <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
                                        <option value="부재 시 문 앞에 놓아주세요">부재 시 문 앞에 놓아주세요</option>
                                        <option value="빠른 배송 부탁드립니다">빠른 배송 부탁드립니다</option>
                                        <option value="택배함에 보관해주세요">택배함에 보관해주세요</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">결제 정보</div>
                        <div className="card-body">
                            <div className="mb-3 row">
                                <label className="col-sm-2 col-form-label">결제 방식</label>
                                <div className="col-sm-10">
                                    <select
                                        className="form-select"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="무통장입금">무통장입금</option>
                                        <option value="네이버페이">네이버페이</option>
                                        <option value="카카오페이">카카오페이</option>
                                        <option value="신용카드">신용카드</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mb-4">
                        <button className="btn btn-secondary" onClick={() => navigate("/cart")}>
                            장바구니로 돌아가기
                        </button>
                        <button className="btn btn-info" onClick={handleOrderSubmit}>
                            주문 완료
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderComponent;