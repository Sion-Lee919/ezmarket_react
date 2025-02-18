import { useEffect, useState } from "react";

const KakaomapShopInfoComponent = () => {
    //let lat = 37.6112321;
    //let lng = 126.912321321;
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);      
    

    useEffect(() => {
        if (navigator.geolocation) {

            const options = {
                enableHighAccuracy: true,

            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                // 위치가 성공적으로 얻어지면 상태 업데이트
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                },
                (err) => {
                // 에러가 발생하면 에러 메시지 상태 업데이트
                setError(err.message);
                },
                options
          );
        } else {
          setError("Geolocation is not supported by this browser.");
        }

      }, []);

    useEffect(() => {
        if (location){
            kakaomap(location);
        }        
    }, [location])

    const kakaomap=(location) => {

        var infowindow = new window.kakao.maps.InfoWindow({zIndex:1});

        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = {
            center: new window.kakao.maps.LatLng(location.latitude, location.longitude), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };   

        // 지도를 생성합니다    
        var map = new window.kakao.maps.Map(mapContainer, mapOption); 

        // 장소 검색 객체를 생성합니다
        var ps = new window.kakao.maps.services.Places(map);

        // 카테고리로 편의점을 검색합니다
        ps.categorySearch('CS2', placesSearchCB, {useMapBounds:true,useMapCenter:true}); 

        // 키워드 검색 완료 시 호출되는 콜백함수 입니다
        function placesSearchCB (data, status) {



            if (status === window.kakao.maps.services.Status.OK) {
                const home = {y:location.latitude, x:location.longitude};
                var circle = new window.kakao.maps.Circle({
                    center : new window.kakao.maps.LatLng(home?.y, home.x),  // 원의 중심좌표 입니다 
                    radius: 20, // 미터 단위의 원의 반지름입니다 
                    strokeWeight: 3, // 선의 두께입니다 
                    strokeColor: '#75B8FA', // 선의 색깔입니다
                    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'dashed', // 선의 스타일 입니다
                    fillColor: '#CFE7FF', // 채우기 색깔입니다
                    fillOpacity: 0.7  // 채우기 불투명도 입니다
                });
                circle.setMap(map);
                //displayMarker(home);
                for (var i=0; i<data.length; i++) {

                    displayMarker(data[i]);
                    if (i === 1){
                        console.log(data[i]);
                    }
                }       
            }
        }



        // 지도에 마커를 표시하는 함수입니다
        function displayMarker(place) {   
            // 마커를 생성하고 지도에 표시합니다
            var marker = new window.kakao.maps.Marker({
                map: map,
                position: new window.kakao.maps.LatLng(place?.y, place?.x) 
            });

            // 마커에 클릭이벤트를 등록합니다
            window.kakao.maps.event.addListener(marker, 'click', function() {
                // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
            });
        }

    }

    return (
            <div id="map" style={{width:'400px',height:'320px',border:'5px solid black'}}></div>
    )
}

export default KakaomapShopInfoComponent;
