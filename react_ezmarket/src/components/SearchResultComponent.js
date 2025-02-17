import React, { useState, useEffect } from "react";
import { useLocation,Link } from "react-router-dom";
import {Container, Row, Col, Image, Card} from "react-bootstrap";
import axios from "axios";
import FilterComponent from "./FilterComponent";

function SearchResultComponent(){
    const location = useLocation();
    //const filteredItems = location.state?.filteredItems || [];
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
    const [pageSize] = useState(9);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / pageSize);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const queryParams = new URLSearchParams(location.search);
    const searchKeyword = queryParams.get("keyword") || "";
    const [filters, setFilters] = useState({ searchKeyword });

    useEffect(() => {
        axios.get(`http://localhost:9090/filtered-items`, { params: { searchKeyword } })
            .then(res => setFilteredItems(res.data))
            .catch(err => console.error("검색 결과 불러오기 실패!", err));
    }, [searchKeyword]);

    
    return (
        <div>
            총 검색 결과 {filteredItems.length}개
            <FilterComponent setFilters={setFilters} />
            <div className="search-results">
                <Container>
                <Row>
                {currentItems.map(item => (
                    <Col key={item.product_id} xs={12} sm={6} md={4} >
                    
                    <Card style={{ width: '100%', height: '100%'}}>
                    <Link to={`/item/${item.product_id}`} style={{ width: '90%', height: '80%'}}>
                    <Image 
                        src={`http://localhost:9090/showimage?filename=${item.image_url}`}
                        style={{ width: '90%', height: '80%'}}
                        fluid />
                    </Link>
                    <Card.Body>
                        <Card.Title style={{ fontSize: '2rem' }}>{item.name}</Card.Title>
                        <Card.Text style={{ fontSize: '1.9rem' }}>{item.price}원</Card.Text>
                    </Card.Body>
                    </Card>
                    </Col>
                ))}
                </Row>
                </Container>
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