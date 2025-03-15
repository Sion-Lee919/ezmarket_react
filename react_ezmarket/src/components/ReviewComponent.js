import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import cameraIcon from '../assets/camera.svg';
import starIcon from '../assets/star.svg';
import starOnIcon from '../assets/staron.svg';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9090";

const style = {

    edit_buttons_container: {
        display: 'flex',
        gap: '5px', // 버튼 간의 간격을 5px로 설정 (원하는 간격으로 조정 가능)
    },

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
        width: '120px',
        fontSize: '19px',
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
        width: "300px", 
        height: "400px", 
        objectFit: "contain", 
    },
    
    review_even: {
        backgroundColor: '#f9f9f9', // 짝수 번째 항목에 회색 배경
    }
};




const ReviewComponent = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [reviewList, setReviewList] = useState([]);
    var product_id = props.product?.product_id;
    const [reviewId, setReviewId] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [comments, setComments] = useState(null);
    const [memberId, setMemberId] = useState("");
    const [rating, setRating] = useState(1);
    const [previewImg, setPreviewImg] = useState(null);

    const textareaRef = useRef(null);  // textareaRef 생성


    useEffect(() => {
        const randomId = Math.floor(Math.random() * 10000000);
        setReviewId(randomId);

        const token = Cookies.get('jwt_token');
        if (token) {
            setIsLoggedIn(true);
            axios.get(`${API_BASE_URL}/userinfo`, { 
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true
            }).then(response => {
                setMemberId(response.data.member_id);
            });
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    
    useEffect(() => {

        axios({
            url : `${API_BASE_URL}/getreview/${product_id}`,
            method : 'GET',
        })
        .then(function(res){
            setReviewList(res.data);
        })

    }, [product_id])

    const preview = ((imageUrl) => {
        const file = imageUrl;
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreviewImg(reader.result);
            };
        } else {
            setPreviewImg(null);
        }
    })

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
            const response = await axios.post(`${API_BASE_URL}/review/registerreview`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("리뷰 등록 성공:", response.data);
            alert("리뷰등록 성공");

            axios({
                url: `${API_BASE_URL}/getreview/${product_id}`,
                method: 'GET',
            })
            .then(function(res){
                setReviewList(res.data);
            });

            setComments("");
            setRating(1);
            setImageUrl(null);
            setPreviewImg(null);
        } catch (error) {
            console.error("리뷰 등록 실패:", error);
            alert("리뷰 등록 실패")
        }
    };

    const handleReviewDelete = async (review) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${API_BASE_URL}/review/delete?reviewId=${review}`);
                alert("리뷰가 삭제되었습니다.");
                setReviewList(reviewList.filter(target => target.review_id !== review)); // UI 업데이트
            } catch (error) {
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const handleReviewUpdateStart = (review) => {


        setIsEditing(true); // 수정모드 시작
        setReviewId(review.review_id);
        setComments(review.comments);
        setRating(review.rating);
        setImageUrl(review.image_url);
        console.log(review.image_url);
        setPreviewImg(`${API_BASE_URL}/showimage?filename=${review.image_url}&obj=review`);

        // textarea에 포커스를 맞추기
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

    };

    const handleReviewUpdateEnd = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("member_id", memberId);
        formData.append("review_id", reviewId);
        formData.append("comments", comments);
        formData.append("rating", rating);

        if (imageUrl) {
            formData.append("image", imageUrl);
        }

        try {
            await axios.put(`${API_BASE_URL}/review/update?reviewid=${reviewId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("리뷰 수정 완료!");

            // 리뷰 목록 새로 고침
            axios({
                url: `${API_BASE_URL}/getreview/${product_id}`,
                method: 'GET',
            })
            .then(function(res){
                setReviewList(res.data);
            });

            setIsEditing(false); // 수정 모드 종료
            setComments("");
            setRating(1);
            setImageUrl(null);
            setPreviewImg(null);
        } catch (error) {
            console.error("리뷰 수정 실패:", error);
            alert("리뷰 수정 실패");
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setComments("");
        setRating(1);
        setImageUrl(null);
        setPreviewImg(null);
    };

    return (
        <div>
            <div id="review-form" style={style.review_form}>
                <form id="add-review-form" onSubmit={isEditing ? handleReviewUpdateEnd : handleReviewSubmit}>

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
                            ref={textareaRef}
                            id="comments"
                            name="comments"
                            placeholder="후기 내용을 입력하세요"
                            value={comments}
                            required
                            onChange={(e) => setComments(e.target.value)}
                            style={style.review_textarea}
                        ></textarea>
                        {previewImg && (
                            <div style={{ position: "relative", display: "inline-block" }}>
                                <img
                                    src={previewImg}
                                    alt="이미지 미리보기"
                                    style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                                />
                                <button 
                                    onClick={() => {setImageUrl(null);setPreviewImg(null)}} 
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        background: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        fontSize: "16px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={style.button_container}>
                    <label htmlFor="image_url" style={style.review_image_label}></label>
                    <input
                        type="file"
                        name="image_url"
                        id="image_url"
                        accept="image/*"
                        onChange={(e) => {
                            setImageUrl(e.target.files[0]);
                            preview(e.target.files[0]);
                        }}
                        style={{ display: 'none' }}
                    />

                    {!isEditing ? 
                        (
                            <button type="submit" style={style.review_submit_button}>후기작성</button>
                        )
                         : 
                        (
                            <div style={style.edit_buttons_container}>
                            <button type="button" onClick={handleCancelEdit} style={style.review_submit_button}>수정취소</button>
                            <button type="submit" style={style.review_submit_button}>수정완료</button>
                            </div>
                        )}
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
                                <span onClick={() => handleReviewUpdateStart(review)}>수정</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span onClick={() => handleReviewDelete(review.review_id)}>삭제</span>
                            </div>)
                             : 
                            (null)}
                            
                            
                            
                        </div>
                        <div style={style.review_right}>
                            <p>{review.comments}</p>
                            {review.image_url && (<img src={`${API_BASE_URL}/showimage?filename=${review.image_url}&obj=review`} alt="Review" style={style.review_image} />)}
                        </div>
                        </div>
                    ))}
                </div>
            </div>
    
        </div>
    )
}

export default ReviewComponent;