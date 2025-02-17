import React, { useState } from "react";

const FilterComponent = ({ setFilters }) => {
    const [selectedBigCategory, setSelectedBigCategory] = useState('');
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [selectedAlcohol, setSelectedAlcohol] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [isNew, setIsNew] = useState(false);
    const [sortType, setSortType] = useState("latest");

    const bigCategories = ["막걸리", "약주/청주", "소주", "과실주", "리큐르"];
    const subcategoriesMap = {
        "막걸리": ["생막걸리", "살균탁주","생탁주"],
        "약주/청주": ["약주", "청주"],
        "소주": [],
        "과실주": [],
        "리큐르": [],
    };
    const alcoholOptions = ["5도 이하", "6~10도", "11~15도", "16도 이상"];
    const priceOptions = ["1만 원 이하", "1~3만 원", "3~5만 원", "5만 원 이상"];
    const regionOptions = ["서울", "경기", "강원", "충청", "전라", "경상", "제주"];

    const handleBigCategoryChange = (category) => {
        setSelectedBigCategory(category);
        setSelectedSubcategories([]);
        setFilters(prev => ({ ...prev, bigcategory: category, subcategories: [] }));
    };

    // const handleCheckboxChange = (option, setState, stateKey) => {
    //     const updated = setState.includes(option)
    //         ? setState.filter(item => item !== option)
    //         : [...setState, option];
    //     setState(updated);
    //     setFilters(prev => ({ ...prev, [stateKey]: updated }));
    // };
    const handleCheckboxChange = (option, setState, stateKey) => {
        const updated = Array.isArray(setState) && setState.includes(option)
            ? setState.filter(item => item !== option)
            : Array.isArray(setState) ? [...setState, option] : [option]; // setState가 배열이 아닐 경우 새 배열로 만듦
        setState(updated);
        setFilters(prev => ({ ...prev, [stateKey]: updated }));
    };
    
    const handleSortChange = (e) => {
        setSortType(e.target.value);
        setFilters(prev => ({ ...prev, sortType: e.target.value }));
    };

    return (
        <div>
            <h4>카테고리</h4>
            {bigCategories.map(category => (
                <button key={category} onClick={() => handleBigCategoryChange(category)} 
                    style={{ background: selectedBigCategory === category ? "#add8e6" : "white" }}>
                    {category}
                </button>
            ))}

            {selectedBigCategory && (
                <div>
                    <h5>하위 카테고리</h5>
                    {subcategoriesMap[selectedBigCategory]?.map(sub => (
                        <label key={sub}>
                            <input type="checkbox" checked={selectedSubcategories.includes(sub)}
                                onChange={() => handleCheckboxChange(sub, setSelectedSubcategories, 'subcategories')} />
                            {sub}
                        </label>
                    ))}
                </div>
            )}

            <h4>도수</h4>
            {alcoholOptions.map(option => (
                <label key={option}>
                    <input type="checkbox" onChange={() => handleCheckboxChange(option, setSelectedAlcohol, 'alcoholRanges')} />
                    {option}
                </label>
            ))}

            <h4>가격대</h4>
            {priceOptions.map(option => (
                <label key={option}>
                    <input type="checkbox" onChange={() => handleCheckboxChange(option, setSelectedPrices, 'priceRanges')} />
                    {option}
                </label>
            ))}

            <h4>지역</h4>
            {regionOptions.map(region => (
                <label key={region}>
                    <input type="checkbox" onChange={() => handleCheckboxChange(region, setSelectedRegions, 'regions')} />
                    {region}
                </label>
            ))}

            <h4>신제품</h4>
            <label>
                <input type="checkbox" checked={isNew} onChange={() => { setIsNew(!isNew); setFilters(prev => ({ ...prev, newProduct: !isNew })); }} />
                최근 3개월 이내 제품만
            </label>

            <h4>정렬</h4>
            <select onChange={handleSortChange} value={sortType}>
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="lowPrice">가격 낮은 순</option>
                <option value="highPrice">가격 높은 순</option>
            </select>
        </div>
    );
};

export default FilterComponent;

//<span>막걸리</span> 
            {/* 생막걸리 살균탁주 생탁주 */}
 //           <span>약주/청주</span> 
            {/* 약주 청주 */}
 //           <span>소주</span>
 //           <span>리큐르</span>
   //         <span>과실주</span>