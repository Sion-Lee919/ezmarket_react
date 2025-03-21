import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import '../styles/ItemDetail.css';
import ReviewComponent from "./ReviewComponent";
import QnAChatComponent from "./QnAChatComponent";
import QnAChatRoomListComponent from "./QnAChatRoomListComponent";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";
const BASE_URL = process.env.REACT_APP_URL || "http://13.208.47.23:8911";

function ItemDetail() {
    const [dto, setDto] = useState(null);
    const { itemid } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('detail');
    const [user, setUser] = useState(null);
    const [brandid, setBrandid] = useState();
    const [reviewList, setReviewList] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios({
            url: `${API_BASE_URL}/getreview/${itemid}`,
            method: 'GET',
        })
        .then(function(res) {
            setReviewList(res.data);
        });
    }, [itemid]);

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) {
            setIsLoggedIn(true);
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
        }
    }, []);

    useEffect(() => {
        axios({
            url: `${API_BASE_URL}/item/${itemid}`,
            method: 'GET',
        })
        .then(function(res) {
            setDto(res.data);
            const product = {
                product_id: itemid,
                image_url: res.data.image_url,
                name: res.data.name
            };
            let recently_viewed = JSON.parse(Cookies.get('recently_viewed') || '[]');
            if (!recently_viewed.some(item => item.product_id === itemid)) {
                if (recently_viewed.length >= 5) {
                    recently_viewed.shift();
                }
                recently_viewed.push(product);
                Cookies.set('recently_viewed', JSON.stringify(recently_viewed), { expires: 3 });
            }
        });
    }, [itemid]);

    const handleLoginClick = () => {
        const userConfirmed = window.confirm("구매하시려면 회원가입 및 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?");
    
        if (userConfirmed) {
            navigate(`/login?redirect=/item/${itemid}?brand_id=${dto.brand_id}`);
        } else {
            navigate(`/item/${itemid}?brand_id=${dto.brand_id}`);
        }
    };

    const handleIncreaseQuantity = () => {
        if (quantity < dto.stock_quantity)
            setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (/^\d+$/.test(value)) {
            setQuantity(Math.min(dto.stock_quantity, Math.max(1, parseInt(value))));
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const checkUserState = (user) => {
        if (user != null) {
            axios.get(`${API_BASE_URL}/brandinfo?memberid=${user.member_id}`)
                .then(response => {
                    if (response.data) {
                        setBrandid(response.data.brand_id);
                    } else {
                        setBrandid(null);
                    }
                })
                .catch(error => {
                    console.error('브랜드 정보를 가져오는 데 실패.', error);
                });
        } else {
            alert("로그인 후 가능한 기능입니다");
            navigate('/login');
        }
    };

    const getTokenFromCookie = () => {
        return Cookies.get("jwt_token") || null;
    };

    const handleBuyNow = () => {
        const token = getTokenFromCookie();
        if (!token) {
            alert("로그인 후 구매가 가능합니다.");
            return;
        }
        const productInfo = {
            productId: parseInt(itemid),
            quantity: quantity,
            productName: dto.name,
            price: dto.price,
            image: dto.image_url,
            totalPrice: dto.price * quantity
        };
        navigate("/buy/orderid", {
            state: {
                selectedCartItems: [productInfo]
            }
        });
    };

    const handleAddToCart = async (productId, quantity) => {
        const token = getTokenFromCookie();
        if (token) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/cart/add`,
                    null,
                    {
                        params: { productId: productId, quantity: quantity },
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    }
                );
                alert("장바구니에 추가되었습니다!");
            } catch (error) {
                alert(error.response?.data || "장바구니 추가 실패!");
            }
        } else {
            const localCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            const cartItem = {
                cartId: Date.now(),
                productId: parseInt(productId),
                quantity: quantity,
                productName: dto.name,
                price: dto.price,
                image: dto.image_url
            };
            const existingItem = localCart.find(item => item.productId === cartItem.productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                localCart.push(cartItem);
            }
            localStorage.setItem('guestCart', JSON.stringify(localCart));
            alert("장바구니에 추가되었습니다!");
        }
    };

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const token = Cookies.get("jwt_token");
                if (!token) return;
    
                const response = await axios.get(`${API_BASE_URL}/checkLike`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { product_id: itemid },
                    withCredentials: true
                });
    
                setIsLiked(response.data); // 서버에서 true/false 반환
            } catch (error) {
                console.error("찜 상태를 불러오는 중 오류 발생:", error);
            }
        };
    
        fetchLikeStatus();
    }, [itemid]);

    const handleLike = async() => {
        const token = Cookies.get("jwt_token")
        if (!token) {
            alert("로그인이 필요합니다!")
        }

        try {
            await axios.post(`${API_BASE_URL}/like`, null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { product_id: itemid },
                withCredentials: true
            });

            alert("찜 목록에 추가되었습니다!");
            window.location.reload();
        } catch (error) {
            alert("찜하기에 실패했습니다.");
            console.log(error);
        }
    }

    

    const handleUnlike = 
    async () => {
        try {
            const token = Cookies.get("jwt_token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
    
            await axios.post(`${API_BASE_URL}/unlike`, null, {
                headers: { Authorization: `Bearer ${token}` },
                params: { product_id: itemid },
                withCredentials: true
            });

            alert("찜 목록에서 제거되었습니다!");
            window.location.reload();
        } catch (error) {
            alert("찜 취소에 실패했습니다.");
            console.log(error);
        }
    }

    if (!dto) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="product-page-top" style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                maxWidth: '1200px',
                margin: '0 auto',
                justifyContent: 'center',
                paddingTop: '10px',
                height: 'auto'
            }}>
                <div className="product-image" style={{ width: '500px', height: '600px', border: '2px solid #838383' }}>
                    <img
                        alt="제품 이미지"
                        src={`${API_BASE_URL}/showimage?filename=${dto.image_url}&obj=product`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
                <div className="product-details" style={{ width: '400px', height: 'auto' }}>
                    <h3 className="product-title">{dto.name || '정보없음'}</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                        <td style={{ padding: '8px', borderTop: '3px solid #333333', minWidth: '60px' }}><strong>판매가</strong></td>
                        <td style={{ padding: '8px', borderTop: '3px solid #333333' }}>{dto.price ? `${Number(dto.price).toLocaleString()}원` : '정보없음'}</td>
                        </tr>
                        <tr>
                        <td style={{ padding: '8px', minWidth: '60px'}}><strong style={{}}>구매혜택</strong></td>
                        <td style={{ padding: '8px'}}>적립 포인트 : {(dto.price * 0.05) || '정보없음'}이지</td>
                        </tr>
                        <tr>
                        <td style={{ padding: '8px', minWidth: '60px'}}><strong>판매자</strong></td>
                        <td style={{ padding: '8px'}}>{dto.brandname || '정보없음'}</td>
                        </tr>
                        <tr>
                        <td style={{ padding: '8px', minWidth: '60px'}}><strong>구매제한</strong></td>
                        <td style={{ padding: '8px'}}>{dto.stock_quantity || '정보없음'}</td>
                        </tr>
                        <tr>
                        <td style={{ padding: '8px', minWidth: '60px', borderBottom: '3px solid #333333' }}><strong>양조장</strong></td>
                        <td style={{ padding: '8px', borderBottom: '3px solid #333333' }}>{dto.product_region || '정보없음'}</td>
                        </tr>
                    </tbody>
                    </table>
                    <div>
                        <>
                            <div style={{ width: '100px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong style={{ marginLeft: '10px', marginRight: '10px', minWidth: '40px' }}>수량</strong>
                                <button
                                    onClick={handleDecreaseQuantity}
                                    style={{ padding: '5px 10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    style={{
                                        width: '50px',
                                        textAlign: 'center',
                                        padding: '5px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    }}
                                />
                                <button
                                    onClick={handleIncreaseQuantity}
                                    style={{ padding: '5px 8px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
                                >
                                    +
                                </button>
                            </div>
                            <button className="product-handle-button" onClick={() => handleAddToCart(itemid, quantity)}>장바구니에 추가</button>
                            {isLoggedIn ? (
                                <button className="product-handle-button" onClick={handleBuyNow}>즉시 구매</button>

                            ) : (
                                <button className="product-handle-button" onClick={handleLoginClick}>회원가입 후 구매</button>
                            )}
                                {isLiked ? (
                                    <button className="product-handle-button" onClick={handleUnlike}>💙 찜 취소</button>):
                                    (<button className="product-handle-button" onClick={handleLike}>🤍 찜 하기</button>)
                                }
                            </>
                      

                        <h3 style={{ marginTop: "20px" }}>이 전통주가 취향에 맞으셨다면?</h3>
                        <button className="product-handle-button" onClick={() => navigate(`/brandItems?brand_id=${dto.brand_id}`)}>브랜드의 다른 제품도 만나보세요</button>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="product-page-bottom" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '1800px',
                margin: '0 auto',
                justifyContent: 'center',
                paddingTop: '50px',
                height: 'auto'
            }}>
                <div style={{ flexDirection: 'row', gap: '10px' }}>
                    <button className="tab-button" onClick={() => handleTabClick('detail')}>상품 상세 정보</button>
                    <button className="tab-button" onClick={() => handleTabClick('delivery')}>배송 안내</button>
                    <button className="tab-button" onClick={() => handleTabClick('return')}>교환 및 반품 안내</button>
                    <button className="tab-button" onClick={() => handleTabClick('review')}>상품 후기 ({reviewList.length})</button>
                    <button className="tab-button" onClick={() => {checkUserState(user); handleTabClick('inquiry'); }}>상품 문의</button>
                </div>
                <div style={{ flex: 1, minWidth: '250px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    {activeTab === 'detail' && (
                        <div>
                            <h4>상품 상세 정보</h4>
                            <p style={{fontSize : '20px'}}>{dto.description}</p>
                            <h4>원재료</h4>
                            <p style={{fontSize : '20px'}}>{dto.product_ingredient}</p>
                        </div>
                    )}
                    {activeTab === 'delivery' && (
                        <div>
                            <h4>배송 안내</h4>
                            <p>배송에 대한 정보를 여기에 추가하세요.</p>
                        </div>
                    )}
                    {activeTab === 'return' && (
                        <div>
                            <h4>교환 및 반품 안내</h4>
                            <p>교환 및 반품 정책에 대한 정보를 여기에 추가하세요.</p>
                        </div>
                    )}
                    {activeTab === 'review' && (
                        <ReviewComponent product={dto}></ReviewComponent>
                    )}
                    {activeTab === 'inquiry' && (
                        brandid === dto.brand_id ? (
                            <div>
                                <QnAChatRoomListComponent product={dto} isSeller={true}/>
                            </div>
                        ) : (
                            <div>
                                <QnAChatComponent product={dto} isSeller={false}/>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItemDetail;