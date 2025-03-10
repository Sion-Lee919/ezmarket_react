import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/MainBannerSlide.css"; // 스타일 적용

const bannerImages = [
    { id: 1, imageUrl: "/images/ez1.png", link: "/brandItems?brand_id=7"},
    { id: 2, imageUrl: "/images/ez3.png", link: "/item/1006?brand_id=1"},
    { id: 3, imageUrl: "/images/ez2.png", link: "/brandItems?brand_id=10"},
];

// 🔹 이전 화살표 (왼쪽)
const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div 
            className={`custom-arrow custom-prev ${className}`} 
            style={{ ...style }} 
            onClick={onClick}
        >
            ❮
        </div>
    );
};

// 🔹 다음 화살표 (오른쪽)
const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div 
            className={`custom-arrow custom-next ${className}`} 
            style={{ ...style }} 
            onClick={onClick}
        >
            ❯
        </div>
    );
};

function MainBannerSlide() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 15000, 
        arrows: true,
        prevArrow: <CustomPrevArrow />, // 🔹 커스텀 이전 화살표
        nextArrow: <CustomNextArrow />, // 🔹 커스텀 다음 화살표
    };

    return (
        <div className="banner-container">
            <Slider {...settings}>
                {bannerImages.map((banner) => (
                    <div key={banner.id} className="banner-slide">
                        <a href={banner.link} className="banner-link">
                            <img src={banner.imageUrl} alt={`Banner ${banner.id}`} className="banner-img" />
                            <div className="banner-text">{banner.text}</div>
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default MainBannerSlide;


