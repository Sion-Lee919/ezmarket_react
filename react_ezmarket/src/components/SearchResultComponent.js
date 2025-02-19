import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import axios from "axios";
import FilterComponent from "./FilterComponent";

function SearchResultComponent() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchKeyword = queryParams.get("keyword") || "";

    const [filteredItems, setFilteredItems] = useState([]);
    const [filters, setFilters] = useState({});
    const [resetFilters, setResetFilters] = useState(false);

    const fetchFilteredItems = async (updatedFilters) => {
        try {
            const response = await axios.post("http://localhost:9090/filtered-items", {
                ...updatedFilters,
                searchKeyword
            });

            setFilteredItems(response.data);
        } catch (error) {
            console.error("검색 결과 불러오기 실패!", error);
        }
    };

    useEffect(() => {
      
        setFilters({});
        setResetFilters(true); 
        fetchFilteredItems({});
    }, [searchKeyword]);

    useEffect(() => {
        fetchFilteredItems(filters);
    }, [filters]);

    return (
        <div>
            <h3>      {/*  전체검색결과 넣을거임 */}
            {searchKeyword
                ? `"${searchKeyword}" 검색 결과 ${filteredItems.length}개`
                : `총 검색 결과 ${filteredItems.length}개`}
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
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>{item.price}원</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default SearchResultComponent;






