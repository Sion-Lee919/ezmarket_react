import React from "react";
import "../styles/FooterComponent.css";

const FooterComponent = () => {
  return (
    <footer id="footer">
      <div className="footer-container">
        {/* 판매자 문의 버튼 */}
        <div className="seller_inquiry">
          <a href="" className="seller_btn">
            판매자 문의하기
          </a>
        </div>

        {/* 판매자 신청 - 현진 추가*/}
        <div className="commerce">
          <a href="../commerce" className="commerce_btn">
            판매자 신청하기
          </a>
        </div>

        {/* 회사 정보 */}
        <div className="footer-section company-info">
          <h4>회사 정보</h4>
          <p>농업회사법인 우리도가(주) 서울지점</p>
          <p>경기도 포천시 군내면 용두로 13-34 이지마켓</p>
          <p><strong>대표:</strong> 김이지</p>
          <p><strong>사업자등록번호:</strong> 506-88-09463</p>
        </div>

        {/* 고객센터 정보 */}
        <div className="footer-section contact-info">
          <h4>고객센터</h4>
          <p><strong>대표번호:</strong> 070-4563-7899</p>
          <p><strong>팩스번호:</strong> 02-123-4567</p>
          <p>
            <strong>메일:</strong> <a href="mailto:ezmarket@naver.com" className="btn_email">ezmarket@naver.com</a>
          </p>
        </div>

        {/* 이용 안내 & 개인정보 */}
        <div className="footer-section service-links">
          <h4>이용 안내</h4>
          <a href="../service/guide.php">이용안내</a>
          <a href="../service/private.php">개인정보처리방침</a>
          <a href="../service/agreement.php">이용약관</a>
        </div>
      </div>

      {/* 저작권 정보 */}
      <div className="copyright">
        ⓒ 2025 www.ezmarket.com. All Rights Reserved.
      </div>
    </footer>
  );
};

export default FooterComponent;


