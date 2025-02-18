import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchButtonClick = async () => {
        if (!searchTerm.trim()) return;

        try {
            const response = await axios.post('http://localhost:9090/filtered-items', {
                searchKeyword: searchTerm
            });

            navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`, { state: { filteredItems: response.data } });
        } catch (error) {
            console.error('검색 요청 실패', error);
        }

        setSearchTerm('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="search-container">
            <input 
                className="search-input"
                type="text" 
                placeholder="상품 검색..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchButtonClick()}
            />
            <button 
                className="search-button" 
                onClick={handleSearchButtonClick}
                disabled={!searchTerm.trim()}
            >
                검색
            </button>
        </div>
    );
};

export default SearchComponent;
