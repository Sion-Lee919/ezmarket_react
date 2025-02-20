import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import axios from "axios";
import FilterComponent from "./FilterComponent";
import "../styles/SearchResultComponent.css";

function SearchResultComponent() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchKeyword = queryParams.get("keyword") || "";

    const [filteredItems, setFilteredItems] = useState([]);
    const [filters, setFilters] = useState({});
    const [resetFilters, setResetFilters] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalCount, setTotalCount] = useState(0);
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const pageGroupSize = 10;

    const fetchFilteredItems = async (updatedFilters) => {
        try {
            const response = await axios.post("http://localhost:9090/filtered-items", {
                ...updatedFilters,
                searchKeyword,
                page: currentPage,
                limit: itemsPerPage
            });

            setFilteredItems(response.data.items);  // 배열만 저장
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error("검색 결과 불러오기 실패!", error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        //fetchFilteredItems(filters, newPage);
    };

    const cleanTitle = (title) => {
        return title.split(" - ")[0];  
    };

    // useEffect(() => {
    //     setFilters({});
    //     setResetFilters(true); 
    //     setCurrentPage(1);
    //     fetchFilteredItems({});
    // }, [searchKeyword]);
    useEffect(() => {
        setFilters({});
        setResetFilters(true);
        setCurrentPage(1);
        fetchFilteredItems({}, 1);
    }, [searchKeyword]);


    // useEffect(() => {
    //     setCurrentPage(1);
    //     fetchFilteredItems(filters);
    // }, [filters]);
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);


    // useEffect(() => {
    //     fetchFilteredItems(filters);
    // }, [filters, currentPage]);
    useEffect(() => {
        fetchFilteredItems(filters, currentPage);
    }, [filters, currentPage]);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - Math.floor(pageGroupSize / 2));
        let endPage = Math.min(totalPages, startPage + pageGroupSize - 1);

        if (endPage - startPage < pageGroupSize - 1) {
            startPage = Math.max(1, endPage - pageGroupSize + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={currentPage === i ? "active" : ""}
                    onClick={() => handlePageChange(i)}
                    aria-label={`페이지 ${i}`}
                    aria-current={currentPage === i ? "page" : undefined}
                    tabIndex="0"
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div>
            <h3>      {/*  전체검색결과 넣을거임 */}
            {searchKeyword
                ? `"${searchKeyword}" 검색 결과 ${totalCount}개`
                : `총 검색 결과 ${totalCount}개`}
            </h3>
            <FilterComponent setFilters={setFilters} resetFilters={resetFilters} setResetFilters={setResetFilters} />

            <Container>
                <Row>
                    {filteredItems.map(item => (
                        <Col key={item.product_id} xs={12} sm={6} md={4}>
                            <Card>
                                <Link to={`/item/${item.product_id}`}>
                                    <Image src={`http://localhost:9090/showimage?filename=${item.image_url}&obj=product`} fluid />
                                </Link>
                                <Card.Body>
                                    <Card.Title>{cleanTitle(item.name)}</Card.Title>
                                    <Card.Text>{item.price}원</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <div className="pagination">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => handlePageChange(1)}
                    aria-label="첫 페이지로 이동"
                    tabIndex="0"
                >
                    처음으로
                </button>
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label="이전 페이지로 이동"
                    tabIndex="0"
                >
                    이전
                </button>

                {renderPageNumbers()} 

                <button 
                    disabled={currentPage >= totalPages} 
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label="다음 페이지로 이동"
                    tabIndex="0"
                >
                    다음
                </button>
                <button 
                    disabled={currentPage >= totalPages} 
                    onClick={() => handlePageChange(totalPages)}
                    aria-label="마지막 페이지로 이동"
                    tabIndex="0"
                >
                    마지막으로
                </button>
            </div>
        </div>
    );
}

export default SearchResultComponent;






