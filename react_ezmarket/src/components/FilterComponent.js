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
        "전통주 전체" : "",
        "막걸리" : "탁주(막걸리)",
        "소주" : "소주",
        "약주/청주" : "약주/청주",
        "과실주" : "과실주",
        "리큐르" : "리큐르"
    };

    const regionMapping = {
        "지역 전체": "",
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
        "최신순" : "latest",
        "낮은 가격순" : "lowPrice",
        "높은 가격순" : "highPrice",
        "인기순" : "popular",
    };
    
    return (
        <div className="filter-container">
            <h2 className="filter-title">내 입맛에 맞게 찾기</h2>

            <div className="filter-row">
                {/* 대분류 */}
                <select
                    className="filter-select custom-select"
                    value={filters.bigcategory}
                    onChange={(e) => updateQueryParams("bigcategory", e.target.value)}
                >
                    {Object.keys(categoryMapping).map((displayCategory) => (
                        <option key={displayCategory} value={categoryMapping[displayCategory]}>
                            {displayCategory}
                        </option>
                    ))}
                </select>

                {/* 지역 */}
                <select
                    className="filter-select"
                    value={filters.regions}
                    onChange={(e) => updateQueryParams("regions", e.target.value)}
                >
                    {Object.keys(regionMapping).map((displayRegion) => (
                        <option key={displayRegion} value={regionMapping[displayRegion]}>
                            {displayRegion}
                        </option>
                    ))}
                </select>

                {/* 정렬 기준 */}
                <select
                    className="filter-select"
                    value={filters.sortType}
                    onChange={(e) => updateQueryParams("sortType", e.target.value)}
                >
                    {Object.keys(sortMapping).map((displaySort) => (
                        <option key={displaySort} value={sortMapping[displaySort]}>
                            {displaySort}
                        </option>
                    ))}
                </select>

                {/* 신상품 버튼
                <button
                    className={`filter-button ${filters.newProduct ? "active" : ""}`}
                    onClick={() => updateQueryParams("newProduct", !filters.newProduct)}
                >
                    {filters.newProduct ? "신상품" : "신상품"}
                </button> */}
            </div>
        </div>
    );
};

export default FilterComponent;







