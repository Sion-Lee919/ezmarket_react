import React, { useState, useEffect } from "react";
import "../styles/FilterComponent.css"; 

import { useCallback } from "react";
import _ from "lodash";

const FilterComponent = ({ setFilters, resetFilters, setResetFilters }) => {
    const categories = [
        { label: "전체", value: "" },
        { label: "막걸리", value: "탁주(막걸리)" },
        { label: "약주/청주", value: "약주/청주" },
        { label: "소주", value: "소주" },
        { label: "리큐르", value: "리큐르" }
    ];

    const subcategoriesMap = {
        "탁주(막걸리)": ["생막걸리", "살균탁주", "생탁주"],
        "약주/청주": ["약주", "청주"]
    };

    const regions = ["서울", "경기", "전라", "경상", "제주"];
    const sortOptions = [
        { label: "최신순", value: "latest" },
        { label: "오래된순", value: "oldest" },
        { label: "낮은 가격순", value: "lowPrice" },
        { label: "높은 가격순", value: "highPrice" }
    ];

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [alcoholRanges, setAlcoholRanges] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);
    const [newProduct, setNewProduct] = useState(false);
    const [sortType, setSortType] = useState("latest");

    useEffect(() => {
       
        const debouncedUpdate = _.debounce(() => {
            setFilters({
                bigcategory: selectedCategory,
                subcategories: selectedSubcategories,
                alcoholRanges,
                regions: selectedRegions,
                priceRanges,
                newProduct,
                sortType
            });
        }, 300); 
    
        
        debouncedUpdate();
    
 
        return () => debouncedUpdate.cancel();
    }, [selectedCategory, selectedSubcategories, selectedRegions, alcoholRanges, priceRanges, newProduct, sortType]);
    
    useEffect(() => {
        if (resetFilters) {
            setSelectedCategory("");
            setSelectedSubcategories([]);
            setSelectedRegions([]);
            setAlcoholRanges([]);
            setPriceRanges([]);
            setNewProduct(false);
            setSortType("latest");
            setResetFilters(false); 
        }
    }, [resetFilters]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
        setSelectedSubcategories([]);
    };

    const handleSubcategoryClick = (sub) => {
        setSelectedSubcategories(prev =>
            prev.includes(sub) ? prev.filter(item => item !== sub) : [...prev, sub]
        );
    };

    const handleRegionClick = (region) => {
        setSelectedRegions(prev =>
            prev.includes(region) ? prev.filter(item => item !== region) : [...prev, region]
        );
    };

    const handleAlcoholRangeToggle = (min, max) => {
        setAlcoholRanges(prev => {
            const exists = prev.some(range => range.min === min && range.max === max);
            return exists ? prev.filter(range => !(range.min === min && range.max === max)) : [...prev, { min, max }];
        });
    };

    const handlePriceRangeToggle = (min, max) => {
        setPriceRanges(prev => {
            const exists = prev.some(range => range.min === min && range.max === max);
            return exists ? prev.filter(range => !(range.min === min && range.max === max)) : [...prev, { min, max }];
        });
    };

    const handleNewProductToggle = () => {
        setNewProduct(prev => !prev);
    };

    const handleSortChange = (sortValue) => {
        setSortType(sortValue);
    };

    return (
        <div className="filter-container">
            <h3>필터 검색</h3>

            <h4>대분류</h4>
            {categories.map(cat => (
                <button
                    key={cat.value}
                    className={selectedCategory === cat.value ? "filter-button active" : "filter-button"}
                    onClick={() => handleCategoryClick(cat.value)}
                >
                    {cat.label}
                </button>
            ))}

            {selectedCategory && subcategoriesMap[selectedCategory] && (
                <>
                    <h4>서브카테고리</h4>
                    {subcategoriesMap[selectedCategory].map(sub => (
                        <button
                            key={sub}
                            className={selectedSubcategories.includes(sub) ? "filter-button active" : "filter-button"}
                            onClick={() => handleSubcategoryClick(sub)}
                        >
                            {sub}
                        </button>
                    ))}
                </>
            )}
            <h4>지역</h4>
            {regions.map(region => (
                <button
                    key={region}
                    className={selectedRegions.includes(region) ? "filter-button active" : "filter-button"}
                    onClick={() => handleRegionClick(region)}
                >
                    {region}
                </button>
            ))}

            <h4>도수 범위</h4>
            <button
                className={alcoholRanges.some(range => range.min === 0 && range.max === 10) ? "filter-button active" : "filter-button"}
                onClick={() => handleAlcoholRangeToggle(0, 10)}
            >
                0~10%
            </button>
            <button
                className={alcoholRanges.some(range => range.min === 10 && range.max === 20) ? "filter-button active" : "filter-button"}
                onClick={() => handleAlcoholRangeToggle(10, 20)}
            >
                10~20%
            </button>
            <button
                className={alcoholRanges.some(range => range.min === 20 && range.max === 30) ? "filter-button active" : "filter-button"}
                onClick={() => handleAlcoholRangeToggle(20, 30)}
            >
                20~30%
            </button>

            <h4>가격 범위</h4>
            <button
                className={priceRanges.some(range => range.min === 0 && range.max === 10000) ? "filter-button active" : "filter-button"}
                onClick={() => handlePriceRangeToggle(0, 10000)}
            >
                0~1만원
            </button>
            <button
                className={priceRanges.some(range => range.min === 10000 && range.max === 30000) ? "filter-button active" : "filter-button"}
                onClick={() => handlePriceRangeToggle(10000, 30000)}
            >
                1~3만원
            </button>
            <button
                className={priceRanges.some(range => range.min === 30000 && range.max === 50000) ? "filter-button active" : "filter-button"}
                onClick={() => handlePriceRangeToggle(30000, 50000)}
            >
                3~5만원
            </button>

            <h4>신상품</h4>
            <button
                className={newProduct ? "filter-button active" : "filter-button"}
                onClick={handleNewProductToggle}
            >
                {newProduct ? "적용됨" : "적용 안됨"}
            </button>

            <h4>정렬 기준</h4>
            {sortOptions.map(opt => (
                <button
                    key={opt.value}
                    className={sortType === opt.value ? "filter-button active" : "filter-button"}
                    onClick={() => handleSortChange(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default FilterComponent;







