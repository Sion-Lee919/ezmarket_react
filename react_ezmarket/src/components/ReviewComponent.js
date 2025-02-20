import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const style = {
    review_box: {
        borderBottom: '1px solid black',
    }

}

const ReviewComponent = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [reviewList, setReviewList] = useState([]);
    var product_id = props.product?.product_id;
    const [reviewId, setReviewId] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [comments, setComments] = useState(null);
    const [memberId, setMemberId] = useState("");

    useEffect(() =>{
        const token = Cookies.get('jwt_token');
        if (token) {
            setIsLoggedIn(true);
            axios.get('http://localhost:9090/userinfo', { 
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true
              })
              .then(response => {
                setMemberId(response.data.member_id);
              })
        } else {
            setIsLoggedIn(false);
        }

    }, [])
    
    useEffect(() => {

        axios({
            url : `http://localhost:9090/getreview/${product_id}`,
            method : 'GET',
        })
        .then(function(res){
            setReviewList(res.data);
        })

    }, [product_id])

    const anonymize = (nickname) => {
        if (nickname.length > 1) {
            const firstChar = nickname.charAt(0);
            const masked = '*'.repeat(nickname.length - 1);
            return firstChar + masked;
        }
        return nickname;
    };

    const handleReviewSubmit = async (e) => {

        e.preventDefault();

        const randomId = Math.floor(Math.random() * 10000000);
        setReviewId(randomId);

        const formData = new FormData();
        formData.append("product_id", product_id);
        formData.append("member_id", memberId);
        formData.append("review_id", reviewId);
        formData.append("comments", comments);

        if (imageUrl) {
            formData.append("image", imageUrl);
        }

        try {
            const response = await axios.post(`http://localhost:9090/review/registerreview`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("리뷰 등록 성공:", response.data);
            alert("리뷰등록 성공");

            axios({
                url: `http://localhost:9090/getreview/${product_id}`,
                method: 'GET',
            })
            .then(function(res){
                setReviewList(res.data);  // 새로운 리뷰 목록으로 갱신
            });

            setComments("");
        } catch (error) {
            console.error("리뷰 등록 실패:", error);
            alert("리뷰 등록 실패")
        }
    };


    return (
        <div>
            <div id="review-form">
                <form id="add-review-form" onSubmit={handleReviewSubmit}>
                    <label htmlFor="product_id"></label>
                    <input type="hidden" id="review_id" name="review_id" value={reviewId}/>
                    
                    <label htmlFor="member_id"></label>
                    <input type="hidden" id="member_id" name="member_id" value={memberId}/>

                    {/* 별 평점 1~5 */}

                    <label htmlFor="comments"></label>
                    <textarea 
                        id="comments" 
                        name="comments" 
                        placeholder="후기 내용을 입력하세요" 
                        required
                        onChange={(e) => setComments(e.target.value)}
                    ></textarea><br/>

                    <label htmlFor="image_url"></label>
                    <input 
                        type="file" 
                        name="image_url" 
                        accept="image/*"
                        onChange={(e) => setImageUrl(e.target.files[0])} 
                    /><br/><br/>
                    <button type="submit">후기 작성</button>
                </form>
            </div>

            <div id="review-section">
                <div id="review-list">
                    {reviewList.map(review => (
                        <div style={style.review_box}>
                            <span>
                            <p>{(memberId == review.member_id)? review.nickname : anonymize(review.nickname)}</p>
                            <p>{review.review_date}</p>
                            </span>
                            <span><p>{review.comments}</p></span>
                        </div>
                    ))}
                </div>
            </div>
    
        </div>
    )
}

export default ReviewComponent;