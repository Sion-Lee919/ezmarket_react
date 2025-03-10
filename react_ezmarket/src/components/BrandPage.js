import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../styles/BrandPage.css";
import ItemRegister from "./Itemregister"; // ItemRegister 컴포넌트 임포트

function BrandPage() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
    const [pageSize] = useState(10);  // 페이지당 아이템 수
    const { brandid } = useParams();
    const [showOverlay, setShowOverlay] = useState(false); // 오버레이 상태 추가

    useEffect(() => {
        axios({
            url: `http://localhost:9090/getbranditems/${brandid}`,
            method: 'GET',
        })
        .then(function(res) {
            setItems(res.data);
        });
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
        <div id="wrapper">
            <div id="content">
                <div className="s_wrap">
                    <h1>판매자 페이지</h1>
                    <div className="local_frm02">
                        <button className="btn_link" onClick={() => setShowOverlay(true)}>상품등록</button>
                        <br />
                        <Link to={`/brand/${brandid}/modify`}>
                            <button className="btn_link">판매자 정보 수정</button>
                        </Link>
                    </div>
                    <div className="tbl_head02">
                        <table id="sodr_list" className="tablef">
                            <colgroup>
                                <col className="w50" />
                                <col className="w50" />
                                <col className="w60" />
                                <col className="w120" />
                                <col />
                                <col />
                                <col className="w80" />
                                <col className="w80" />
                                <col className="w90" />
                                <col className="w90" />
                                <col className="w90" />
                                <col className="w90" />
                                <col className="w60" />
                                <col className="w60" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col" rowSpan="2">번호</th>
                                    <th scope="col" rowSpan="2">이미지</th>
                                    <th scope="col">상품코드</th>
                                    <th scope="col" colSpan="2">상품명</th>
                                    <th scope="col">최초등록일</th>
                                    <th scope="col" rowSpan="2">재고</th>
                                    <th scope="col" colSpan="2" className="th_bg">가격정보</th>
                                    <th scope="col" rowSpan="2" colSpan="2">관리</th>
                                </tr>
                                <tr className="rows">
                                    <th scope="col">업체코드</th>
                                    <th scope="col">공급사명</th>
                                    <th scope="col">카테고리</th>
                                    <th scope="col">최근수정일</th>
                                    <th scope="col" className="th_bg">판매가</th>
                                    <th scope="col" className="th_bg">포인트</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <>
                                    <tr key={item.product_id} className={`list${index % 2}`}>
                                        <td rowSpan="2">{index + 1}</td>
                                        <td rowSpan="2"><Link to={`/item/${item.product_id}`} className="item-name-link">
                                          <img src={`http://localhost:9090/showimage?filename=${item.image_url}&obj=product`} width="80" height="80" alt={item.name} /></Link></td>
                                        <td>{item.product_id}</td>
                                        <td colSpan="2" className="tal">{item.name}</td>

                                        <td>{item.created_at}</td>
                                        <td rowSpan="2" className="tar">{item.stock_quantity}</td>
                                        <td rowSpan="2" className="tar">{item.price}</td>
                                        <td rowSpan="2" className="tar">{item.price * 0.1}</td>
                                        <td rowSpan="2"><Link to={`/brand/${brandid}/modify/${item.product_id}`} className="btn_small">수정</Link></td>
                                        <td rowSpan="2"><button onClick={() => handleDelete(item.product_id)} className="btn_small">삭제</button></td>

                                    </tr>
                                    <tr className={`list${index % 2} rows`}>
                                        <td className="fc_00f">{item.brand_id}</td>
                                        <td className="tal txt_succeed">{item.brandname}</td>
                                        <td className="tal txt_succeed">{item.bigcategory}</td>
                                        <td className="fc_00f">{item.update_date}</td>
                                    </tr>
                                    </>
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
            </div>
            {showOverlay && (
                <div className="overlay">
                    <div className="overlay-content">
                        <button className="close-btn" onClick={() => setShowOverlay(false)}>X</button>
                        <ItemRegister onClose={() => setShowOverlay(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default BrandPage;