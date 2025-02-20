import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import cameraIcon from '../assets/camera.svg';
import starIcon from '../assets/star.svg';
import starOnIcon from '../assets/staron.svg';

const style = {

    star_rating: {
        width: '100%',
        boxSizing: 'border-box',
        display: 'inline-flex',
        float: 'left',
        flexDirection: 'row', 
        justifyContent: 'flex-start',
      },
    star_off: {
        width: '45px',
        height: '45px',
        marginRight: '2px',
        display: 'inline-block',
        background: `url(${starIcon}) no-repeat`,
        backgroundSize: '100%',
        boxSizing: 'border-box',
      },
    star_on: {
        width: '45px',
        height: '45px',
        marginRight: '2px',
        display: 'inline-block',
        background: `url(${starOnIcon}) no-repeat`,
        backgroundSize: '100%',
        boxSizing: 'border-box',
    },


    review_form: {
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
    },
    review_textarea_container: {
        width: '100%',
        maxWidth: '100%',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        boxSizing: 'border-box',
        resize: 'none',
        overflow: 'hidden',
    },
    review_textarea: {
        width: '100%',
        height: '120px',
        border: 'none',
        fontSize: '14px',
        padding: '10px',
        boxSizing: 'border-box',
        outline: 'none',
        resize: 'none',
    },
    review_image_input: {
        display: 'none',
    },
    button_container: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: 'space-between',
      },
    review_image_label: {
        backgroundImage: `url(${cameraIcon})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '50px',
        height: '50px',
        border: 'none',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    review_submit_button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '140px',
        fontSize: '21px',
        height: '50px',
    },

    review_box: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid black',
        padding: '10px',
        marginBottom: '0px',
    },
    review_left: {
        flex: '1',
        paddingRight: '10px',
    },
    review_right: {
        flex: '2',
        wordBreak: 'break-word',
    },
    review_author: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    review_date: {
        fontSize: '0.9rem',
        color: '#888',
    },
    review_image: {
        marginTop: '10px',
        maxWidth: '100%',
        height: 'auto',
    },
    review_even: {
        backgroundColor: '#f9f9f9', // 짝수 번째 항목에 회색 배경
    }
};




const ReviewComponent = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [reviewList, setReviewList] = useState([]);
    var product_id = props.product?.product_id;
    const [reviewId, setReviewId] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [comments, setComments] = useState(null);
    const [memberId, setMemberId] = useState("");
    const [rating, setRating] = useState(1);

    useEffect(() =>{

        const randomId = Math.floor(Math.random() * 10000000);
        setReviewId(randomId);

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

    const handleStarClick = (index) => {setRating(index)};

    const renderStarRating = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                style={index < rating ? style.star_on : style.none}
            />
        ));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();


        console.log(reviewId);

        const formData = new FormData();
        formData.append("product_id", product_id);
        formData.append("member_id", memberId);
        formData.append("review_id", reviewId);
        formData.append("comments", comments);
        formData.append("rating", rating);

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
                setReviewList(res.data);
            });

            setComments("");
        } catch (error) {
            console.error("리뷰 등록 실패:", error);
            alert("리뷰 등록 실패")
        }
    };

    return (
        <div>
            <div id="review-form" style={style.review_form}>
                <form id="add-review-form" onSubmit={handleReviewSubmit}>

                <div style={style.star_rating}>
                    {Array.from({ length: 5 }, (_, index) => (
                        <span
                        key={index}
                        style={index < rating ? style.star_on : style.star_off}
                        onClick={() => handleStarClick(index + 1)}
                        value={index + 1}
                        >
                        </span>
                    ))}
                </div>

                    <label htmlFor="product_id"></label>
                    <input type="hidden" id="review_id" name="review_id" value={reviewId} />
                    <label htmlFor="member_id"></label>
                    <input type="hidden" id="member_id" name="member_id" value={memberId} />

                    <label htmlFor="rating"></label>
                    <input type="hidden" id="rating" name="rating" value={rating} />

                    <div style={style.review_textarea_container}>
                        <textarea
                            id="comments"
                            name="comments"
                            placeholder="후기 내용을 입력하세요"
                            required
                            onChange={(e) => setComments(e.target.value)}
                            style={style.review_textarea}
                        ></textarea>
                    </div>

                    <div style={style.button_container}>
                    <label htmlFor="image_url" style={style.review_image_label}></label>
                    <input
                        type="file"
                        name="image_url"
                        id="image_url"
                        accept="image/*"
                        onChange={(e) => setImageUrl(e.target.files[0])}
                        style={{ display: 'none' }}
                    />

                    <button type="submit" style={style.review_submit_button}>후기 작성</button>
                    </div>

                </form>
            </div>

            <div id="review-section">
                <div id="review-list">
                    {reviewList.map((review, index) => (
                        <div style={{...style.review_box, ...(index % 2 === 0 ? style.review_even : {})}} key={review.review_id} className={index % 2 === 0 ? 'even' : ''}>
                        <div style={style.review_left}>
                            <p style={style.review_author}>{(memberId == review.member_id) ? review.nickname : anonymize(review.nickname)}</p>
                            <p style={style.review_date}>{review.review_date}</p>
                            <div style={style.star_rating}>
                                {renderStarRating(review.rating)}  {/* 평점 별 시각화 */}
                            </div>
                            {(memberId == review.member_id)? 
                            (<div>
                                <span>수정</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span>삭제</span>
                                {/* 수정 삭제 기능 추가 예정 */}
                            </div>)
                             : 
                            (null)}
                            
                            
                            
                        </div>
                        <div style={style.review_right}>
                            <p>{review.comments}</p>
                            {review.image_url && (<img src={`http://localhost:9090/showimage?filename=${review.image_url}&obj=review`} alt="Review Image" style={style.review_image} />)}
                        </div>
                        </div>
                    ))}
                </div>
            </div>
    
        </div>
    )
}

export default ReviewComponent;