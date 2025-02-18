import { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function ItemDetail(){

    const [dto, setDto] = useState(null);
    const {itemid} = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    if (!dto) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-page" style={{
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
                    <td style={{ padding: '8px', borderTop: '3px solid #333333' }}><strong>판매가</strong></td>
                    <td style={{ padding: '8px', borderTop: '3px solid #333333' }}>{dto.price ? `${dto.price}원` : '정보없음'}</td>
                    </tr>
                    <tr>
                    <td style={{ padding: '8px'}}><strong>구매혜택</strong></td>
                    <td style={{ padding: '8px'}}>적립 포인트 : {(dto.price * 0.05) || '정보없음'}이지</td>
                    </tr>
                    <tr>
                    <td style={{ padding: '8px'}}><strong>브랜드</strong></td>
                    <td style={{ padding: '8px'}}>{dto.brand_id || '정보없음'}</td>
                    </tr>
                    <tr>
                    <td style={{ padding: '8px', borderBottom: '3px solid #333333' }}><strong>양조장</strong></td>
                    <td style={{ padding: '8px', borderBottom: '3px solid #333333' }}>{dto.product_region || '정보없음'}</td>
                    </tr>
                </tbody>
                </table>
                <div>
                    {isLoggedIn? (
                    <>
                        <button className="add-to-cart" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>장바구니에 추가</button>
                        <button className="buy-now" style={{ width: '100%', padding: '10px', marginTop: '10px' }}>즉시 구매</button>
                    </>
                    ) : (
                    <button className="sign-up-to-buy" style={{ width: '100%', padding: '10px', marginTop: '10px' }} onClick={handleLoginClick}>회원가입 후 구매</button>
                    )}
                </div>
            </div>
            {/* 상품 상세정보, 배송안내, 교환/반품안내, 상품 후기, 상품 문의 추가예정 */}
        </div>
      );
      
      

}

export default ItemDetail;