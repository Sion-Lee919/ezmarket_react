import React, { useEffect, useState } from "react";

const KakaoRedirectHandler = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      console.log("받은 카카오 인가 코드:", code);

      fetch("http://localhost:9090/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("로그인 성공:", data);
          alert("로그인 성공! 사용자 정보를 확인하세요.");
          window.location.href = "/";
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

  if (loading) return <div>로그인 처리 중...</div>;
  if (error) return <div>로그인 실패: {error}</div>;

  return null;
};

export default KakaoRedirectHandler;
