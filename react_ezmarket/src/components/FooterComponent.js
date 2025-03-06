import React from "react";
import "../styles/FooterComponent.css";

const FooterComponent = () => {
  return (
    <footer className="footer bg-secondary text-white py-4 mt-5" > 
      <div className="container">
        <div className="row">

          <div className="col-md-4">
            <h5>회사 정보</h5>
            <p>농업회사법인 우리도가(주) 서울지점</p>
            <p>경기도 포천시 군내면 용두로 13-34 이지마켓</p>
            <p><strong>대표:</strong> 김이지</p>
            <p><strong>사업자등록번호:</strong> 506-88-09463</p>
          </div>

          <div className="col-md-4">
            <h5>고객센터</h5>
            <p><strong>대표번호:</strong> 070-4563-7899</p>
            <p><strong>팩스번호:</strong> 02-123-4567</p>
            <p>
              <strong>메일:</strong> <a href="mailto:ezmarket@naver.com" className="text-white">ezmarket@naver.com</a>
            </p>
          </div>

          <div className="col-md-4">
            <h5>이용 안내</h5>
            <a href="../service/guide.php" className="text-white d-block">이용안내</a>
            <a href="../service/private.php" className="text-white d-block">개인정보처리방침</a>
            <a href="../service/agreement.php" className="text-white d-block">이용약관</a>
          </div>
        </div>

        <div className="text-center mt-4">
          <a href="" className="btn btn-outline-light me-3">판매자 문의하기</a> {/* 버튼 색상 유지 */}
          <a href="../commerce" className="btn btn-light">판매자 신청하기</a> {/* 버튼 색상 유지 */}
        </div>
      </div>

      <div className="text-center mt-4">
        <small>ⓒ 2025 www.ezmarket.com. All Rights Reserved.</small>
      </div>
    </footer>
  );
};

export default FooterComponent;

