import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/HeaderCategory.css";


const categoryMapping = {
    "전체": "",
    "막걸리": "탁주(막걸리)",
    "소주": "소주",
    "약주/청주": "약주/청주",
    "과실주": "과실주",
    "리큐르": "리큐르"
};

const regionMapping = {
    "전체": "",
    "서울": "서울",
    "경기": "경기",
    "인천": "인천",
    "전라": "전라",
    "강원": "강원",
    "충청": "충청",
    "경상": "경상",
    "제주": "제주"
};

const HeaderCategory = ({ text }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // 드롭다운 열기/닫기
    const toggleDropdown = () => setIsOpen(!isOpen);

    // 카테고리 클릭 시 URL 업데이트
    const handleCategoryClick = (category) => {
        queryParams.set("bigcategory", categoryMapping[category]);
        queryParams.set("page", "1"); // 페이지 초기화
        navigate(`/items?${queryParams.toString()}`);
    };

    // 지역 클릭 시 URL 업데이트
    const handleRegionClick = (region) => {
        queryParams.set("regions", regionMapping[region]);
        queryParams.set("page", "1"); // 페이지 초기화
        navigate(`/items?${queryParams.toString()}`);
    };

    return (
        <div className="header-category" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            <span className="category-text">{text}</span>
            {isOpen && (
                <div className="dropdown-menu">
                    {text === "전통주 종류" && Object.keys(categoryMapping).map((category) => (
                        <div key={category} className="dropdown-item" onClick={() => handleCategoryClick(category)}>
                            {category}
                        </div>
                    ))}
                    {text === "지역" && Object.keys(regionMapping).map((region) => (
                        <div key={region} className="dropdown-item" onClick={() => handleRegionClick(region)}>
                            {region}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeaderCategory;


