import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/FilterComponent.css";

const FilterComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [showDetailFilter, setShowDetailFilter] = useState(false);

    const filters = {
        bigcategory: queryParams.get("bigcategory") || "",
        regions: queryParams.getAll("regions") || [],
        newProduct: queryParams.get("newProduct") === "true",
        sortType: queryParams.get("sortType") || "latest",
        sweetnesss: queryParams.getAll("sweetnesss").map(Number) || [],
        sournesss: queryParams.getAll("sournesss").map(Number) || [],
        carbonations: queryParams.getAll("carbonations").map(Number) || [],
        bodys: queryParams.getAll("bodys").map(Number) || [],
    };

    const updateQueryParams = (key, value) => {
        queryParams.delete(key);
        value.forEach((val) => queryParams.append(key, val));
        queryParams.set("page", "1");
        navigate(`?${queryParams.toString()}`);
    };

    const handleCircleClick  = (key, value) => {
        const updatedValues = filters[key].includes(value)
            ? filters[key].filter((v) => v !== value)
            : [...filters[key], value];

        updateQueryParams(key, updatedValues);
    };

    const renderFilterOptions = (key) => (
        [1, 2, 3, 4, 5].map((num) => (
            <div
                key={num}
                className={`circle-option ${filters[key].includes(num) ? "selected" : ""}`}
                onClick={() => handleCircleClick(key, num)}
            >
                {num}
            </div>
        ))
    );

    const resetFilters = () => {
        navigate("?");
    };

    const categoryMapping = {
        "전통주 전체": "",
        "막걸리": "탁주(막걸리)",
        "소주": "소주",
        "약주/청주": "약주/청주",
        "과실주": "과실주",
        "리큐르": "리큐르"
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

    const arrayMapping = {
        "최신순" : "latest",
        "낮은 가격순" : "lowPrice",
        "높은 가격순" : "highPrice",
        "인기순" : "popular"
    };



    return (
        <div className="filter-container">
            <div className="filter-header">
                <h2 className="filter-title">내 입맛에 맞게 찾기</h2>
                <button className="reset-button" onClick={resetFilters}>검색어 및 취향 초기화</button>
            </div>

            <div className="filter-row">
                <select
                    className="filter-select"
                    value={filters.bigcategory}
                    onChange={(e) => updateQueryParams("bigcategory", [e.target.value])}
                >
                    {Object.entries(categoryMapping).map(([key, value]) => (
                        <option key={value} value={value}>{key}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filters.regions}
                    onChange={(e) => updateQueryParams("regions", [e.target.value])}
                >
                    {Object.entries(regionMapping).map(([key, value]) => (
                        <option key={value} value={value}>{key}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={filters.sortType}
                    onChange={(e) => updateQueryParams("sortType", [e.target.value])}
                >
                    {Object.entries(arrayMapping).map(([key, value]) => (
                        <option key={value} value={value}>{key}</option>
                    ))}
                </select>
            </div>

            <div className="detail-filter-toggle" onClick={() => setShowDetailFilter(!showDetailFilter)}>
                <h5 className="detail-filter-title">세부적인 맛을 고려해서 찾고 싶으면 ' 클릭 '</h5>
            </div>

          
            <div className={`detail-filter-container ${showDetailFilter ? "show" : ""}`}>
                <div className="detail-filter-row">
                    <div className="filter-group">
                        <label className="filter-label">단맛</label>
                        <div className="circle-group">{renderFilterOptions("sweetnesss")}</div>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">신맛</label>
                        <div className="circle-group">{renderFilterOptions("sournesss")}</div>
                    </div>
                </div>
                <div className="detail-filter-row">
                    <div className="filter-group">
                        <label className="filter-label">탄산감</label>
                        <div className="circle-group">{renderFilterOptions("carbonations")}</div>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">바디감</label>
                        <div className="circle-group">{renderFilterOptions("bodys")}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FilterComponent;





