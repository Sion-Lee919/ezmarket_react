import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
function BrandPage(){

    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
    const [pageSize] = useState(10);  // 페이지당 아이템 수
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

    // 현재 페이지에 해당하는 아이템만 추출
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 수 계산
    const totalPages = Math.ceil(items.length / pageSize);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                </tr>
              </thead>
              <tbody>
                {currentItems.map(item => (
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

          <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}  // 첫 페이지일 때 "이전" 버튼 비활성화
                >
                    이전
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}  // 마지막 페이지일 때 "다음" 버튼 비활성화
                >
                    다음
                </button>
            </div>
        </div>
      );
      
      

}

export default BrandPage;