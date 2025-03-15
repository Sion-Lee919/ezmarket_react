import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const Modifyitem = () => {
    const { brandid, productid } = useParams(); // URL에서 브랜드 ID와 상품 ID 가져오기
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        image_url: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/item/${productid}`).then((res) => {
            setProduct(res.data);
        });
    }, [productid]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("product_id", productid);
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("volume", product.volume);
        formData.append("price", product.price);
        formData.append("alcohol", product.alcohol);
        formData.append("stock_quantity", product.stock_quantity);
        formData.append("alcohol", product.alcohol);
        formData.append("product_ingredient", product.product_ingredient);
        formData.append("product_region", product.product_region);
        formData.append("bigcategory", product.bigcategory);
        formData.append("subcategory", product.subcategory);
        formData.append("sweetness", product.sweetness);
        formData.append("sourness", product.sourness);
        formData.append("carbonation", product.carbonation);
        formData.append("body", product.body);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            await axios.post(`${API_BASE_URL}/brand/id/updateitem`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("상품이 성공적으로 수정되었습니다.");
            navigate(`/brand/${brandid}`); // 수정 후 브랜드 상품 목록으로 이동
        } catch (error) {
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h2>상품 수정</h2>
            <form onSubmit={handleSubmit}>
                <label>상품명:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} />

                <label>설명:</label>
                <textarea name="description" value={product.description} onChange={handleChange} />

                <label>가격:</label>
                <input type="number" name="price" value={product.price} onChange={handleChange} />

                <label>용량:</label>
                <input type="text" name="volume" value={product.volume} onChange={handleChange} />

                <label>도수:</label>
                <input type="number" name="alcohol" value={product.alcohol} onChange={handleChange} />

                <label>단맛:</label>
                <input type="number" name="sweetness" value={product.sweetness} onChange={handleChange} />

                <label>신맛:</label>
                <input type="number" name="sourness" value={product.sourness} onChange={handleChange} />

                <label>탄산감:</label>
                <input type="number" name="carbonation" value={product.carbonation} onChange={handleChange} />

                <label>바디감:</label>
                <input type="number" name="body" value={product.body} onChange={handleChange} />

                <label>재고:</label>
                <input type="number" name="stock_quantity" value={product.stock_quantity} onChange={handleChange} />
                
                <label>원재료:</label>
                <input type="text" name="product_ingredient" value={product.product_ingredient} onChange={handleChange} />
                <label>생산지역:</label>
                <input type="text" name="product_region" value={product.product_region} onChange={handleChange} />
                <label>빅 카테고리:</label>
                <input type="text" name="bigcategory" value={product.bigcategory} onChange={handleChange} />
                <label>하위 카테고리:</label>
                <input type="text" name="subcategory" value={product.subcategory} onChange={handleChange} />

                <label>현재 이미지:</label>
                {product.image_url ? (
                <img
                    src={`${API_BASE_URL}/showimage?filename=${product.image_url}&obj=product`}
                    alt="Product"
                    style={{ maxWidth: '20%', height: '20%' }}
                    
                />
            ) : (
                <p>이미지가 없습니다.</p>
            )}
                <label>새 이미지 업로드:</label>
                
                <input type="file" name="image" onChange={handleFileChange} />
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
};

export default Modifyitem;

