import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import FilterComponent from "./FilterComponent";
import "../styles/SearchResultComponent.css";



const SearchResultComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const isFirstRender = useRef(true);

    const searchParams = {
        searchKeyword: queryParams.get("searchKeyword") || "",
        bigcategory: queryParams.get("bigcategory") || "",
        regions: queryParams.getAll("regions") || [],
        newProduct: queryParams.get("newProduct") === "true",
        sortType: queryParams.get("sortType") || "latest",
        page: parseInt(queryParams.get("page"), 10) || 1,
    };



    const [filteredItems, setFilteredItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 12;
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

    useEffect(() => {
        const fetchFilteredItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/items?${queryParams.toString()}`);
                setFilteredItems(response.data.items);
                setTotalCount(response.data.totalCount);
            } catch (error) {
                console.error("검색 결과 불러오기 실패!", error);
            }
        };
        fetchFilteredItems();
    }, [location.search]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; 
            return; 
        }
    
        if (searchParams.searchKeyword) {
            const newQueryParams = new URLSearchParams();
            newQueryParams.set("searchKeyword", searchParams.searchKeyword);
            newQueryParams.set("page", "1");
    
            navigate(`/items?${newQueryParams.toString()}`, { replace: true });
        }
    }, [searchParams.searchKeyword]);



    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        queryParams.set("page", newPage);
        navigate(`?${queryParams.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const maxVisiblePages = 10;
    const startPage = Math.max(1, searchParams.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const cleanTitle = (title) => {
        return title ? title.split(" - ")[0] : "상품명 없음";
    };

    return (
        <div>
            <FilterComponent />
            <h3>{searchParams.searchKeyword ? `"${searchParams.searchKeyword}" 검색 결과 ${totalCount}개` : `총 검색 결과 ${totalCount}개`}</h3>

            <Container>
            <Row>
                {filteredItems.map((item) => (
                <Col key={item.product_id} xs={12} sm={6} md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                    <Link to={`/item/${item.product_id}?brand_id=${item.brand_id}`}>
                        <Image 
                        src={`${API_BASE_URL}/showimage?filename=${item.image_url}&obj=product`} 
                        fluid 
                        className="card-img-custom" 
                        />
                    </Link>
                    <Card.Body className="d-flex flex-column justify-content-between">
                        <Card.Title>{cleanTitle(item.name)}</Card.Title>
                        <Card.Text>{item.price.toLocaleString()}원</Card.Text>
                    </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>
            </Container>


            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(1)} disabled={searchParams.page === 1}>
                        처음
                    </button>
                    <button onClick={() => handlePageChange(searchParams.page - 1)} disabled={searchParams.page === 1}>
                        이전
                    </button>

                    {pageNumbers.map((num) => (
                        <button 
                            key={num} 
                            onClick={() => handlePageChange(num)}
                            className={num === searchParams.page ? "active" : ""}
                        >
                            {num}
                        </button>
                    ))}

                    <button onClick={() => handlePageChange(searchParams.page + 1)} disabled={searchParams.page >= totalPages}>
                        다음
                    </button>
                    <button onClick={() => handlePageChange(totalPages)} disabled={searchParams.page >= totalPages}>
                        마지막
                    </button>
                </div>
            )}



        </div>
    );
};

export default SearchResultComponent;





