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
    }, [brandid]);

    const handleDelete = async (product_id) => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
          try {
              await axios.delete(`http://localhost:9090/brand/${brandid}/delete/${product_id}`);
              alert("상품이 삭제되었습니다.");
              setItems(items.filter(item => item.product_id !== product_id)); // UI 업데이트
          } catch (error) {
              alert("삭제 중 오류가 발생했습니다.");
          }
      }
  };

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
                  <th>수정</th>
                  <th>삭제</th>
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
                    <td>
                      <Link to={`/brand/${brandid}/modify/${item.product_id}`}>
                        <button>수정하기</button>
                      </Link>
                    </td>
                    <td>
                     <button onClick={() => handleDelete(item.product_id)}>삭제하기</button>
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      
      

}

export default BrandPage;