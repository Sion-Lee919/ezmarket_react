// Search.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchComponent = () => {
    const products = [];
    const [searchTerm, setSearchTerm] = useState('');
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        axios({
            url : `http://localhost:9090/getallitemsforsearch`,
            method : 'GET',

        })
        .then(function(res){
            setAllItems(res.data);
            setFilteredItems(res.data);
        });
    }, [])

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        // 검색 로직: 이름이나 카테고리에 검색어가 포함된 아이템 필터링 -> 
        if (term){
            const results = allItems.filter(item => 
                item.name.toLowerCase().includes(term.toLowerCase()) /*|| item.category.includes(term)*/
            );
            setFilteredItems(results);
        } else { setFilteredItems(allItems); }
    };

    /*
    const highlightTerm = (text) => {
        if (!searchTerm) return text; // 검색어가 없으면 그대로 반환
        const regex = new RegExp(`(${searchTerm})`, 'gi'); // 대소문자 구분 없이 검색어 강조
        const parts = text.split(regex); // 검색어를 기준으로 문자열 분리
        return parts.map((part, index) => 
            regex.test(part) ? <span key={index} className="highlight">{part}</span> : part
        ); // 강조된 부분과 나머지 부분을 함께 반환
    };
    */

    return (
        <div className= "search-container">
            <input 
                className="search-input"
                type="text" 
                placeholder="상품 검색..." 
                value={searchTerm} 
                onChange={handleSearch} 
            />
            {searchTerm && filteredItems.length > 0 && (
            <div className='search-result'>
                {filteredItems.slice(0,5).map(item => ( // slice 로 자동완성 길이 제한
                <div key={item.id} className='search-item'>
                  <Link key={item.id} to={`/item/${item.product_id}`}>
                    {item.name}
                  </Link>
                </div>
                ))}
            </div>
            )}
        </div>
    );
};

export {SearchComponent};