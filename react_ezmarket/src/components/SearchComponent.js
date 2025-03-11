import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash"; 

const SearchComponent = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(queryParams.get("searchKeyword") || "");
    const [suggestions, setSuggestions] = useState([]); // 연관 검색어
    const [isSearching, setIsSearching] = useState(false); // 검색 실행 여부
    const searchContainerRef = useRef(null); // 검색창 & 연관 검색어 컨테이너 참조

    const fetchSuggestions = debounce(async (query) => {
        if (query.length > 1 && !isSearching) {
            try {
                const res = await axios.get("http://localhost:9090/searchitems", {
                    params: { searchKeyword: query }
                });
                if (Array.isArray(res.data)) {
                    setSuggestions(res.data.slice(0, 10).map(item => item.name)); // 최대 10개 제한
                }
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        }
    }, 300);

    useEffect(() => {
        if (!isSearching) { 
            fetchSuggestions(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (isSearching) {
            queryParams.set("searchKeyword", searchTerm);
            navigate(`/items?${queryParams.toString()}`);
            setSuggestions([]);
            setIsSearching(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isSearching]); 

    const handleSearch = () => {
        if (!searchTerm.trim()) return;
        setIsSearching(true); 
        setSuggestions([]); 
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setIsSearching(true);
        setSuggestions([]); 
    };

    
    const handleClickOutside = (event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside); 
        return () => {
            document.removeEventListener("click", handleClickOutside); 
        };
    }, []);

    const clearSearch = () => {
        setSearchTerm(""); 
        setSuggestions([]); 
    };

    return (
        <div className="position-relative w-50 w-lg-75 flex-grow-1" ref={searchContainerRef}>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="마시고 싶은 술을 검색해보세요!"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsSearching(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    style={{ borderWidth: "2px", borderColor: "rgb(24, 159, 219)"}}
                />
                {searchTerm && (
                    <button type="button" className="btn custom-outline-primary" onClick={clearSearch}>
                        ×
                    </button>
                )}
                <button className="btn custom-outline-primary" onClick={handleSearch} disabled={!searchTerm.trim()}>
                    검색
                </button>
            </div>

            {suggestions.length > 0 && !isSearching && (
                <ul className="list-group position-absolute w-100 mt-1 bg-white shadow-lg" style={{ zIndex: 1050, maxHeight: "200px", overflowY: "auto" }}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} className="list-group-item list-group-item-action" onClick={() => handleSuggestionClick(suggestion)} style={{ cursor: "pointer" }}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchComponent;




