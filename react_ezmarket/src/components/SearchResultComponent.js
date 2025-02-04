import React from "react";
import { useLocation } from "react-router-dom";
//import axios from "axios";

function SearchResultComponent(){
    const location = useLocation();
    //const keyword = new URLSearchParams(location.search).get('keyword');
    const filteredItems = location.state?.filteredItems || [];

    return (
        <div>
            총 검색 결과 {filteredItems.length}개
            <div className="search-results">
                {filteredItems.map(item => (
                    <div key={item.product_id} className="search-item">
                        <a href={`/item/${item.product_id}`}>{item.name}</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchResultComponent;