import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import ReviewComponent from "./ReviewComponent";

const style = {
    tabButton: {
        backgroundColor: 'transparent',
        border: '1px #ccc',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        color: '#333',
        width: '300px',
        fontSize: '24px',
        fontWeight: '530',
    }
};

function ItemDetail() {
    const [dto, setDto] = useState(null);
    const { itemid } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('detail');
    const [reviewList, setReviewList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:9090/getreview/${itemid}`)
            .then(res => setReviewList(res.data))
            .catch(error => console.error("상품 리뷰 불러오기 실패!", error));
    }, [itemid]);

    useEffect(() => {
        const token = Cookies.get('jwt_token');
        if (token) setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:9090/item/${itemid}`)
            .then(res => setDto(res.data))
            .catch(error => console.error("상품 정보 불러오기 실패!", error));
    }, [itemid]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleIncreaseQuantity = () => {
        if (dto && quantity < dto.stock_quantity) {
            setQuantity(prevQuantity => prevQuantity + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (/^\d+$/.test(value) && dto) {
            setQuantity(Math.min(dto.stock_quantity, Math.max(1, parseInt(value))));
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleAddToCart = async () => {
        const token = Cookies.get("jwt_token");
        if (!token) {
            alert("로그인 후 장바구니를 이용할 수 있습니다.");
            console.warn("장바구니 추가 실패 - 로그인 필요!");
            return;
        }

        console.log("장바구니 추가 버튼 클릭됨 - 상품 ID:", dto?.product_id, "수량:", quantity);

        try {
            const response = await axios.post(
                "http://localhost:9090/api/cart/add",
                null,
                {
                    params: {
                        productId: dto?.product_id,
                        quantity: quantity
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );

            console.log("장바구니 추가 성공! 응답 데이터:", response.data);
            alert(response.data.message || "장바구니에 추가되었습니다!");
        } catch (error) {
            console.error("장바구니 추가 실패:", error.response?.data || error.message);
            alert(error.response?.data?.message || "장바구니 추가 실패!");
        }
    };

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
                paddingTop: '50px',
                height: 'auto'
            }}>
                <div className="product-image" style={{ width: '500px', height: 'auto', border: '2px solid #838383' }}>
                    <img
                        alt="제품 이미지"
                        src={`http://localhost:9090/showimage?filename=${dto.image_url}&obj=product`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className="product-details" style={{ width: '400px', height: 'auto' }}>
                    <h3 className="product-title">{dto.name || '정보없음'}</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td><strong>판매가</strong></td>
                                <td>{dto.price ? `${dto.price}원` : '정보없음'}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        {isLoggedIn ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <strong>수량</strong>
                                    <button onClick={handleDecreaseQuantity}>-</button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        style={{ width: '50px', textAlign: 'center' }}
                                    />
                                    <button onClick={handleIncreaseQuantity}>+</button>
                                </div>
                                <button 
                                    className="add-to-cart" 
                                    onClick={handleAddToCart}
                                    style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
                                    장바구니에 추가
                                </button>
                                {}
                                <button 
                                    className="buy-now" 
                                    style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
                                    즉시 구매
                                </button>
                            </>
                        ) : (
                            <button className="sign-up-to-buy" style={{ width: '100%', padding: '10px', marginTop: '10px' }} onClick={handleLoginClick}>
                                회원가입 후 구매
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemDetail;
