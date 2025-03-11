import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    const openDropdown = () => setIsOpen(true);
    const closeDropdown = () => setIsOpen(false);

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
        <div className="dropdown" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
            {/* 드롭다운 버튼 */}
            <button className="btn custom-outline-primary dropdown-toggle" type="button">
                {text}
            </button>

            {/* 드롭다운 메뉴 */}
            <ul className={`dropdown-menu custom-dropdown ${isOpen ? "show" : ""}`}>
                {text === "전통주 종류" &&
                    Object.keys(categoryMapping).map((category) => (
                        <li key={category}>
                            <button className="dropdown-item" onClick={() => handleCategoryClick(category)}>
                                {category}
                            </button>
                        </li>
                    ))}
                {text === "지역" &&
                    Object.keys(regionMapping).map((region) => (
                        <li key={region}>
                            <button className="dropdown-item" onClick={() => handleRegionClick(region)}>
                                {region}
                            </button>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default HeaderCategory;


