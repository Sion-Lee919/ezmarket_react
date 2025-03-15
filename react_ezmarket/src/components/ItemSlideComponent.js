import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, Image, Container } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/ItemSlideComponent.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

function ItemSlideComponent() {
    const [randomItems, setRandomItems] = useState([]);
    const [popularItems, setPopularItems] = useState([]);
    const [newItems, setNewItems] = useState([]);

    useEffect(() => {

        axios.get(`${API_BASE_URL}/getitemsforrandom`)
            .then((res) => {
                setRandomItems(res.data.random || []);
                setPopularItems(res.data.popular || []);
                setNewItems(res.data.new || []);
            });
    }, []);

    // react-slick 슬라이더
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 6,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const cleanTitle = (title) => {
        return title ? title.split(" - ")[0] : "상품명 없음";
    };

    return (
        <Container className="mt-4 mb-5">
            <h3 className="text-center mb-3">인기 상품 Top 6</h3>
            <Slider {...sliderSettings}>
                {popularItems.map((item) => (
                    <div key={item.product_id} className="slide-item ">
                        <Card className="shadow-sm card-fixed card-hover">
                            <Link to={`/item/${item.product_id}?brand_id=${item.brand_id}`}>
                                <Image
                                    src={`${API_BASE_URL}/showimage?filename=${item.image_url}&obj=product`}
                                    className="card-img-custom"
                                />
                            </Link>
                            <Card.Body className="card-body-custom ">
                                <Card.Title>{cleanTitle(item.name)}</Card.Title>
                                <Card.Text>{item.price.toLocaleString()}원</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </Slider>

     
            <h3 className="text-center mt-4 mb-3"> 신상품 Top 6</h3>
            <Slider {...sliderSettings}>
                {newItems.map((item) => (
                    <div key={item.product_id} className="slide-item">
                        <Card className="shadow-sm card-fixed card-hover">
                            <Link to={`/item/${item.product_id}?brand_id=${item.brand_id}`}>
                                <Image
                                    src={`${API_BASE_URL}/showimage?filename=${item.image_url}&obj=product`}
                                    className="card-img-custom"
                                />
                            </Link>
                            <Card.Body className="card-body-custom">
                                <Card.Title>{cleanTitle(item.name)}</Card.Title>
                                <Card.Text>{item.price.toLocaleString()}원</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>

                ))}
            </Slider>

            <h3 className="text-center mt-4 mb-3">이지 마켓의 추천 상품</h3>
            <Slider {...sliderSettings}>
                {randomItems.map((item) => (
                    <div key={item.product_id} className="slide-item">
                        <Card className="shadow-sm card-fixed card-hover">
                            <Link to={`/item/${item.product_id}?brand_id=${item.brand_id}`}>
                                <Image
                                    src={`${API_BASE_URL}/showimage?filename=${item.image_url}&obj=product`}
                                    className="card-img-custom"
                                />
                            </Link>
                            <Card.Body className="card-body-custom">
                                <Card.Title>{cleanTitle(item.name)}</Card.Title>
                                <Card.Text>{item.price.toLocaleString()}원</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </Slider>
        </Container>
    );
}
export default ItemSlideComponent;





