import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import axios from "axios";
import "../styles/BrandItem.css";

const API_BASE_URL = "http://localhost:9090";

// URL에서 쿼리 파라미터 가져오는 함수
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const BrandItem = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const brand_id = query.get("brand_id");  
    const [filteredItems, setFilteredItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 12;
    const currentPage = parseInt(query.get("page"), 10) || 1;

    useEffect(() => {
        if (!brand_id) {
            setLoading(false);
            return;
        }

        const fetchBrandItems = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/brandItems?brand_id=${brand_id}&page=${currentPage}&limit=${itemsPerPage}`
                );

                if (response.data && response.data.items) {
                    setFilteredItems(response.data.items);
                    setTotalCount(response.data.totalCount || 0);
                } else {
                    setFilteredItems([]);
                    setTotalCount(0);
                }
            } catch (error) {
                setFilteredItems([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchBrandItems();
    }, [brand_id, currentPage]);


    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        query.set("page", newPage);
        navigate(`?${query.toString()}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const maxVisiblePages = 10;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const cleanTitle = (title) => {
        return title ? title.split(" - ")[0] : "상품명 없음";
    };

    return (
        <div>
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
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                        처음
                    </button>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        이전
                    </button>

                    {pageNumbers.map((num) => (
                        <button
                            key={num}
                            onClick={() => handlePageChange(num)}
                            className={num === currentPage ? "active" : ""}
                        >
                            {num}
                        </button>
                    ))}

                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                        다음
                    </button>
                    <button onClick={() => handlePageChange(totalPages)} disabled={currentPage >= totalPages}>
                        마지막
                    </button>
                </div>
            )}
        </div>
    );
};

export default BrandItem;



