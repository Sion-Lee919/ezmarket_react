import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/FilterComponent.css";

const FilterComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const filters = {
        bigcategory: queryParams.get("bigcategory") || "",
        regions: queryParams.getAll("regions") || [],
        newProduct: queryParams.get("newProduct") === "true",
        sortType: queryParams.get("sortType") || "latest",
    };

    const updateQueryParams = (key, value) => {
        queryParams.set(key, value);
        queryParams.set("page", "1");
        navigate(`?${queryParams.toString()}`);
    };

    const categoryMapping = {
        "전체" : "",
        "막걸리" : "탁주(막걸리)",
        "소주" : "소주",
        "약주/청주" : "약주/청주",
        "과실주" : "과실주",
        "리큐르" : "리큐르"
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

    const sortMapping = {
        "최신순": "latest",
        "낮은 가격순": "lowPrice",
        "높은 가격순": "highPrice"
    };
    
    return (
        <div className="filter-container">
            <h3>필터 검색</h3>

            <h4>대분류</h4>
            {Object.keys(categoryMapping).map((displayCategory) => (
                <button
                    key={displayCategory}
                    className={`filter-button ${filters.bigcategory === categoryMapping[displayCategory] ? "active" : ""}`}
                    onClick={() => updateQueryParams("bigcategory", categoryMapping[displayCategory])}
                >
                    {displayCategory}
                </button>
            ))}

            <h4>지역</h4>
            {Object.keys(regionMapping).map((displayRegion) => (
                <button
                    key={displayRegion}
                    className={`filter-button ${filters.regions.includes(regionMapping[displayRegion]) ? "active" : ""}`}
                    onClick={() => updateQueryParams("regions", regionMapping[displayRegion])}
                >
                    {displayRegion}
                </button>
            ))}

            <h4>신상품</h4>
            <button
                className={`filter-button ${filters.newProduct ? "active" : ""}`}
                onClick={() => updateQueryParams("newProduct", !filters.newProduct)}
            >
                {filters.newProduct ? "적용됨" : "적용 안됨"}
            </button>

            <h4>정렬</h4>
            {Object.keys(sortMapping).map((displaySort) => (
                <button
                    key={displaySort}
                    className={`filter-button ${filters.sortType === sortMapping[displaySort] ? "active" : ""}`}
                    onClick={() => updateQueryParams("sortType", sortMapping[displaySort])}
                >
                    {displaySort}
                </button>
            ))}

        </div>
    );
};

export default FilterComponent;







