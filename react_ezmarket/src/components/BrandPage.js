import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
function BrandPage(){

    const [items, setItems] = useState([]);
    const {brandid} = useParams();

    useEffect(() => {
        axios({
            url : `http://localhost:9090/getbranditems/${brandid}`,
            method : 'GET',
        })
        .then(function(res){
            setItems(res.data);
        })
    }, [])

    if (!items) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="brand-items">
                {items.map(item => (
                    <div key={item.product_id} className="search-item">
                        <h1>제품이름 : {<a href={`/item/${item.product_id}`}>{item.name}</a> || '정보없음'}</h1>
                        <p>제품정보 : {item.description || '정보없음'}</p>
                        <p>가격 : {item.price || '정보없음'}</p>
                        <p>수량 : {item.stock_quantity || '정보없음'}</p>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default BrandPage;