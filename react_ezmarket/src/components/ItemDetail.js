import { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
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
        fontWeight: '530', // 글자 굵기 (보통, 두껍게 등)
    }

}

function ItemDetail(){

    const [dto, setDto] = useState(null);
    const {itemid} = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('detail');

    const navigate = useNavigate();

    useEffect(() => {
            const token = Cookies.get('jwt_token');
            if (token) {
              setIsLoggedIn(true);
            }
          }, [])

    useEffect(() => {

        
        console.log(itemid);
        axios({
            url : `http://localhost:9090/item/${itemid}`,
            method : 'GET',

        })
        .then(function(res){
            setDto(res.data);
        })
    }, [itemid])

    const handleLoginClick = () => {
        navigate('/login');  
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
        // 숫자인지 확인하고 양수로만 유지
        if (/^\d+$/.test(value)) {
            setQuantity(Math.min(dto.stock_quantity, Math.max(1, parseInt(value)))); // 최소값 1로 설정
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab); // 클릭된 버튼에 해당하는 정보를 활성화
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
            maxWidth: '1200px',  // 최대 너비
            margin: '0 auto',    // 가운데 정렬
            justifyContent: 'center', // 수평 가운데 정렬
            paddingTop: '50px',
            height: 'auto'
            }}>
                <div className="product-image" style={{ width: '500px', height: 'auto', border: '2px solid #838383' }}>
                    <img
                    alt="제품 이미지"
                    src={`http://localhost:9090/showimage?filename=${dto.image_url}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className="product-details" style={{ width: '400px', height: 'auto' }}>
                    <h3 className="product-title">{dto.name || '정보없음'}</h3>
        
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                        <td style={{ padding: '8px', borderTop: '3px solid #333333', minWidth: '60px' }}><strong>판매가</strong></td>
                        <td style={{ padding: '8px', borderTop: '3px solid #333333' }}>{dto.price ? `${dto.price}원` : '정보없음'}</td>
                        </tr>
                        <tr>
                        <td style={{ padding: '8px', minWidth: '60px'}}><strong style={{}}>구매혜택</strong></td>
                        <td style={{ padding: '8px'}}>적립 포인트 : {(dto.price * 0.05) || '정보없음'}이지</td>
                        </tr>
                        <tr>
                        <td style={{ padding: '8px', minWidth: '60px'}}><strong>브랜드</strong></td>
                        <td style={{ padding: '8px'}}>{dto.brand_id || '정보없음'}</td>
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
                        {isLoggedIn? (
                        <>
                            {/* 구매수량 체크 필요 */}
                            <div style={{ width: '100px',marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ marginLeft: '10px',marginRight: '10px',minWidth: '40px'  }}>수량</strong>
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
                            <button className="add-to-cart" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>장바구니에 추가</button>
                            <button className="buy-now" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>즉시 구매</button>
                        </>
                        ) : (
                        <button className="sign-up-to-buy" style={{ width: '100%', padding: '10px', marginTop: '10px' }} onClick={handleLoginClick}>회원가입 후 구매</button>
                        )}
                    </div>
                </div>
            </div>
            <hr/>
            <div className="product-page-bottom" style={{
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                maxWidth: '1800px',  // 최대 너비
                margin: '0 auto',    // 가운데 정렬
                justifyContent: 'center', // 수평 가운데 정렬
                paddingTop: '50px',
                height: 'auto'
            }}>
                {/* 버튼들 */}
                <div style={{ flexDirection: 'row', gap: '10px' }}>
                    <button style={style.tabButton} onClick={() => handleTabClick('detail')}>상품 상세 정보</button>
                    <button style={style.tabButton} onClick={() => handleTabClick('delivery')}>배송 안내</button>
                    <button style={style.tabButton} onClick={() => handleTabClick('return')}>교환 및 반품 안내</button>
                    <button style={style.tabButton} onClick={() => handleTabClick('review')}>상품 후기</button>
                    <button style={style.tabButton} onClick={() => handleTabClick('inquiry')}>상품 문의</button>
                </div>
                <></>
                {/* 각 탭별 내용 표시 */}
                <div style={{ flex: 1, minWidth: '250px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    {activeTab === 'detail' && (
                        <div>
                            <h4>상품 상세 정보</h4>
                            <p style={{fontSize : '20px'}}>{dto.description}</p>
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
                        <ReviewComponent product={ dto }></ReviewComponent>
                    )}
                    {activeTab === 'inquiry' && (
                        <div>
                            <h4>상품 문의</h4>
                            <p>상품에 대한 문의 사항을 여기에 추가하세요.</p>
                        </div>
                    )}
                </div>
            </div>
        
        </div>
      );
      
      

}

export default ItemDetail;