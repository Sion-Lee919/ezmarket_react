import React, { useEffect, useState } from 'react';

function Home() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:9090/user", {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log("응답 상태 코드:", response.status); 
            return response.json();
        })
        .then(data => {
            console.log("백엔드 응답 데이터:", data); 
            if (!data.authenticated) {
                window.location.href = "/login"; 
            } else {
                setUserData(data);
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
    }, []);
    
    

    return (
        <div>
            <h1>홈 페이지</h1>
            {userData && userData.authenticated ? ( 
                <>
                    <p>환영합니다, {userData.name ? userData.name : "이름 없음"}</p>
                    <p>Email: {userData.email ? userData.email : "이메일 없음"}</p>
                </>
            ) : (
                <p>로그인 정보를 불러오는 중...</p>
            )}
        </div>
    );
}

export default Home;




