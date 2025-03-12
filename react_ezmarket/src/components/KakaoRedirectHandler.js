import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:9090";

const KakaoRedirectHandler = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      console.log("받은 카카오 인가 코드:", code);

      fetch(`${API_BASE_URL}/api/login/kakao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            console.log("JWT 토큰 수신:", data.token);

            localStorage.setItem("jwt", data.token);

            alert("로그인 성공! 쇼핑몰 서비스 이용 가능");
            window.location.href = "/cart";  
          } else {
            throw new Error("JWT 토큰 없음");
          }
        })
        .catch((err) => {
          console.error("로그인 에러:", err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    } else {
      setError("인가 코드가 없습니다.");
      setLoading(false);
    }
  }, []);

  if (loading) return <div>로그인 처리 중</div>;
  if (error) return <div>로그인 실패: {error}</div>;

  return null;
};

export default KakaoRedirectHandler;
