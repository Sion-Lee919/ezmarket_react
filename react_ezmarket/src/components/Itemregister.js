import { useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ItemRegister = () => {
    const navigate = useNavigate();
    const [productId, setProductId] = useState(""); // product_id 상태 추가
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const {brandid} = useParams();

    useEffect(() => {
        const randomId = Math.floor(Math.random() * 1000000000);
        setProductId(randomId);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("product_id", productId); // product_id에 난수 추가
        formData.append("seller_id", brandid);
        formData.append("name", productName);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock_quantity", stockQuantity);
        if (imageUrl) {
            formData.append("image", imageUrl);
        }

        try {
            const response = await axios.post(`http://localhost:9090/brand/id/registeritem`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("상품 등록 성공:", response.data);
            // 성공 시 처리
            navigate(`/brand/${brandid}`);
        } catch (error) {
            console.error("상품 등록 실패:", error);
            alert("상품 등록 실패")
        }
    };

    return (
        <div>
            <h1>상품등록페이지입니다.</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="product_id"></label>
                <input type="hidden" name="product_id" value={productId} />


                <label htmlFor="seller_id"></label>
                <input type="hidden" name="seller_id" value={brandid} readOnly />
                
                <label htmlFor="name">제품이름</label>
                <input 
                    type="text" 
                    name="name" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)} 
                /><br />
                
                <label htmlFor="description">설명</label>
                <textarea 
                    name="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                ></textarea><br />
                
                <label htmlFor="price">가격</label>
                <input 
                    type="text" 
                    name="price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                /><br />
                
                <label htmlFor="stock_quantity">재고</label>
                <input 
                    type="text" 
                    name="stock_quantity" 
                    value={stockQuantity} 
                    onChange={(e) => setStockQuantity(e.target.value)} 
                /><br />
                
                <label htmlFor="image_url">이미지</label>
                <input 
                    type="file" 
                    name="image_url" 
                    accept="image/*" 
                    onChange={(e) => setImageUrl(e.target.files[0])} 
                /><br />
                
                <button type="submit">상품등록</button>
            </form>
        </div>
    );
}

export default ItemRegister;
