import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
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
    }, [brandid])

    if (!items) {
        return <div>Loading...</div>;
    }

    return (
        <div>
          <Link to={`/brand/${brandid}/itemregister`} className="register-link">상품등록</Link>
          <div className="brand-items">
            <table className="item-table">
              <thead>
                <tr>
                  <th>제품이름</th>
                  <th>도수</th>
                  <th>가격</th>
                  <th>수량</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.product_id}>
                    <td>
                      <Link to={`/item/${item.product_id}`} className="item-name-link">
                        {item.name || '정보없음'}
                      </Link>
                    </td>
                    <td>{item.alcohol || '정보없음'}</td>
                    <td>{item.price || '정보없음'}</td>
                    <td>{item.stock_quantity || '정보없음'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      
      

}

export default BrandPage;