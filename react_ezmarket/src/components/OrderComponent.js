import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const styles = {
  container: {
    maxWidth: '900px',
    margin: '20px auto', 
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    fontSize: '40px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '30px 0',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
    padding: '10px 15px',
    borderBottom: '1px solid #ddd',
    marginBottom: '15px'
  },
  card: {
    marginBottom: '25px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
    fontSize: '24px'
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '20px'
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
  },
  label: {
    width: '150px',
    textAlign: 'left',
    fontSize: '20px',
    color: '#333',
    padding: '0 15px 0 0'
  },
  formField: {
    flex: 1,
    border: '1px solid #ddd',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '20px'
  },
  select: {
    border: '1px solid #ddd',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '20px',
    width: '100%',
    backgroundColor: '#fff'
  },
  submitBtn: {
    backgroundColor: '#0088cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '22px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  backBtn: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '22px',
    cursor: 'pointer',
  },
  radioContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '20px'
  },
  radioInput: {
    marginRight: '8px'
  },
  summaryBox: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    marginTop: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0'
  },
  priceLabel: {
    fontSize: '24px'
  },
  priceValue: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0',
    borderTop: '1px solid #ddd',
    paddingTop: '10px'
  },
  totalLabel: {
    fontSize: '26px',
    fontWeight: 'bold'
  },
  totalValue: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#0066cc'
  },
  mileageInfo: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'right',
    marginTop: '5px'
  }
};

const OrderComponent = () => {
    const location = useLocation();
    const selectedCartItems = location.state?.selectedCartItems || [];
    const navigate = useNavigate();

    const [shippingMessage, setShippingMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("무통장입금");
    const [address, setAddress] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [receiverEmail, setReceiverEmail] = useState("");
    const [memberPoints, setMemberPoints] = useState(0);
    const [usedPoints, setUsedPoints] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [userInfo, setUserInfo] = useState(null);

    const getTokenFromCookie = () => {
        return Cookies.get('jwt_token') || null;
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = getTokenFromCookie();
            if (token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/userinfo`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        withCredentials: true
                    });
                    
                    setUserInfo(response.data);
                    setMemberPoints(Number(response.data.points) || 0);
                    
                    if (response.data.realname) {
                        setReceiverName(response.data.realname);
                    }
                    
                    if (response.data.phone) {
                        setReceiverPhone(response.data.phone);
                    }
                    
                    if (response.data.email) {
                        setReceiverEmail(response.data.email);
                    }
                    
                    if (response.data.address) {
                        setAddress(response.data.address);
                    }
                    
                } catch (error) {
                    console.error("회원 정보를 불러오지 못했습니다:", error);
                    alert("회원 정보를 불러오지 못했습니다.");
                }
            }
        };
        
        fetchUserInfo();
    }, []);

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
        if (!address) {
            alert("주소를 입력해주세요.");
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

        const orderData = {
            shippingAddress: address,
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

        console.log("Order Data Sent to Backend:", orderData);

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
        <div style={styles.container}>
            <h2 style={styles.heading}>주문서 작성</h2>
            
            {selectedCartItems.length === 0 ? (
                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', textAlign: 'center', marginBottom: '20px' }}>
                    <p>선택된 상품이 없습니다.</p>
                    <button 
                        onClick={() => navigate("/cart")}
                        style={styles.backBtn}
                    >
                        장바구니로 돌아가기
                    </button>
                </div>
            ) : (
                <>
                    <div style={styles.card}>
                        <div style={styles.sectionTitle}>주문상품내역</div>
                        <div style={{ padding: '10px' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ ...styles.tableHeader, width: '50%' }}>상품/옵션 정보</th>
                                        <th style={{ ...styles.tableHeader, width: '10%', textAlign: 'center' }}>수량</th>
                                        <th style={{ ...styles.tableHeader, width: '20%', textAlign: 'right' }}>단가</th>
                                        <th style={{ ...styles.tableHeader, width: '20%', textAlign: 'right' }}>금액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCartItems.map((item, index) => (
                                        <tr key={index}>
                                            <td style={styles.tableCell}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img 
                                                        src={`${API_BASE_URL}/showimage?filename=${item.image}&obj=product`} 
                                                        alt={item.productName || '상품 이미지'} 
                                                        style={styles.productImage}
                                                    />
                                                    <div style={{ marginLeft: '10px' }}>
                                                        {item.productName || `상품 ID: ${item.productId}`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ ...styles.tableCell, textAlign: 'center' }}>{item.quantity}</td>
                                            <td style={{ ...styles.tableCell, textAlign: 'right' }}>{item.price ? item.price.toLocaleString() : (item.totalPrice / item.quantity).toLocaleString()}원</td>
                                            <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>{item.totalPrice.toLocaleString()}원</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                                        <td colSpan="3" style={{ ...styles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>상품금액:</td>
                                        <td style={{ ...styles.tableCell, textAlign: 'right', fontWeight: 'bold' }}>{totalAmount.toLocaleString()}원</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.sectionTitle}>적립금 사용</div>
                        <div style={{ padding: '15px' }}>
                            <div style={styles.formRow}>
                                <label style={styles.label}>보유 적립금</label>
                                <input
                                    type="text"
                                    style={{ ...styles.formField, backgroundColor: '#f9f9f9' }}
                                    value={`${memberPoints.toLocaleString()}점`}
                                    readOnly
                                />
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>사용할 적립금</label>
                                <input
                                    type="number"
                                    style={styles.formField}
                                    value={usedPoints}
                                    onChange={handleUsedPointsChange}
                                    min="0"
                                    max={Math.min(memberPoints, totalAmount)}
                                    placeholder="사용할 적립금을 입력하세요"
                                />
                            </div>
                            <div style={{ fontSize: '18px', color: '#666', padding: '0 0 10px 150px' }}>
                                최대 사용 가능 적립금: {Math.min(memberPoints, totalAmount).toLocaleString()}점
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>최종 결제 금액</label>
                                <input
                                    type="text"
                                    style={{ ...styles.formField, backgroundColor: '#f9f9f9', fontWeight: 'bold' }}
                                    value={`${remainingAmount.toLocaleString()}원`}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.sectionTitle}>배송 정보</div>
                        <div style={{ padding: '15px' }}>
                            <div style={styles.formRow}>
                                <label style={styles.label}>받는 사람 <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    style={styles.formField}
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                    placeholder="받는 사람 이름을 입력해주세요"
                                    required
                                />
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>주소 <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    style={styles.formField}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="주소를 입력해주세요"
                                    required
                                />
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>휴대전화 <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    style={styles.formField}
                                    value={receiverPhone}
                                    onChange={handlePhoneChange}
                                    placeholder="휴대전화 번호를 입력해주세요 (예: 010-1234-5678)"
                                    required
                                />
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>이메일 <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="email"
                                    style={styles.formField}
                                    value={receiverEmail}
                                    onChange={(e) => setReceiverEmail(e.target.value)}
                                    placeholder="이메일을 입력해주세요"
                                />
                            </div>
                            <div style={styles.formRow}>
                                <label style={styles.label}>배송 메시지</label>
                                <select
                                    style={styles.select}
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

                    <div style={styles.card}>
                        <div style={styles.sectionTitle}>결제 정보</div>
                        <div style={{ padding: '15px' }}>
                            <div style={{ marginBottom: '15px' }}>결제 방식</div>
                            
                            <div style={styles.radioContainer}>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        style={styles.radioInput}
                                        name="paymentMethod"
                                        value="무통장입금"
                                        checked={paymentMethod === "무통장입금"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    무통장입금
                                </label>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        style={styles.radioInput}
                                        name="paymentMethod"
                                        value="네이버페이"
                                        checked={paymentMethod === "네이버페이"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    네이버페이
                                </label>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        style={styles.radioInput}
                                        name="paymentMethod"
                                        value="카카오페이"
                                        checked={paymentMethod === "카카오페이"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    카카오페이
                                </label>
                                <label style={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        style={styles.radioInput}
                                        name="paymentMethod"
                                        value="신용카드"
                                        checked={paymentMethod === "신용카드"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    신용카드
                                </label>
                            </div>
                            
                            <div style={styles.summaryBox}>
                                <div style={styles.priceRow}>
                                    <div style={styles.priceLabel}>상품금액</div>
                                    <div style={styles.priceValue}>{totalAmount.toLocaleString()}원</div>
                                </div>
                                <div style={styles.priceRow}>
                                    <div style={styles.priceLabel}>적립금</div>
                                    <div style={styles.priceValue}>-{usedPoints.toLocaleString()}원</div>
                                </div>
                                <div style={styles.totalRow}>
                                    <div style={styles.totalLabel}>합계</div>
                                    <div style={styles.totalValue}>{remainingAmount.toLocaleString()}원</div>
                                </div>
                                <div style={styles.mileageInfo}>
                                    적립예정 마일리지 : {usedPoints > 0 ? 0 : Math.floor(totalAmount * 0.05).toLocaleString()} 원
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <button 
                            style={styles.backBtn} 
                            onClick={() => navigate("/cart")}
                        >
                            장바구니로 돌아가기
                        </button>
                        <button 
                            style={styles.submitBtn} 
                            onClick={handleOrderSubmit}
                        >
                            결제하기
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderComponent;