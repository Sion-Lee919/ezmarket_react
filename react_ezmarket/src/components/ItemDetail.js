import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
function ItemDetail(){

    const [dto, setDto] = useState(null);
    const {itemid} = useParams();

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

    if (!dto) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>제품이름 : {dto.name || '정보없음'}</h1>
            <p>제품정보 : {dto.description || '정보없음'}</p>
            <p>가격 : {dto.price || '정보없음'}</p>
            <p>수량 : {dto.stock_quantity || '정보없음'}</p>
            <img alt="제품 이미지"
                 src={`http://localhost:9090/showimage?filename=${dto.image_url}`}
                 style={{ maxWidth: '20%', height: '20%' }}
                />

        </div>
    );

}

export default ItemDetail;