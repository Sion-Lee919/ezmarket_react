import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
//import axios from "axios";

function SearchResultComponent(){
    const location = useLocation();
    const filteredItems = location.state?.filteredItems || [];

    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
    const [pageSize] = useState(10);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / pageSize);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            총 검색 결과 {filteredItems.length}개
            <div className="search-results">
                {currentItems.map(item => (
                    <div key={item.product_id} className="search-item">
                        <a href={`/item/${item.product_id}`}>{item.name}</a>
                    </div>
                ))}
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
    )
}

export default SearchResultComponent;