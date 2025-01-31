import axios from "axios";
import QueryString from "qs";
import { useState } from "react";

function ServerConnection_boot(){
    //변경값 렌더링 가능 변수
    const [message,setMessage] = useState("초기값")
    //동작 이벤트처리
    const ajaxbtn1 = function(){
        axios.get('http://localhost:9090/helloajax')
        .then(function(response){
            setMessage(JSON.stringify(response.data));
        }); //then
    }

    const ajaxbtn2 = function(){
        axios({
            url : "http://localhost:9090/helloajaxparam",
            method : 'get',
            params:{id:'리액트 get방식요청', pw:1111}
        })
        .then(function(response){
            //setMessage(JSON.stringify(response.data));
            setMessage("로그인한 아이디는 " + response.data.id + " 입니다");
        }); //then
    }

    const ajaxbtn3 = function(){
        axios({
            url : "http://localhost:9090/helloajaxparam",
            method : 'post',
            data:{id:'리액트 post방식요청', pw:1111}
            // RequestBody -- json -- parameter 자바객체변환
        })
        .then(function(response){
            //setMessage(JSON.stringify(response.data));
            setMessage("로그인한 아이디는 " + response.data.id + " 입니다");
        }); //then
    }

    // get 배열 전송 형태 - 컨트롤러 다르다
    // paramsSe
    const ajaxbtn4 = function(){
        axios({
            url : "http://localhost:9090/helloajaxarray",
            method : 'get',
            params:{ ids: [1, 5, 9] },
            paramsSerializer : params => {
                console.log(QueryString.stringify(params, {arrayFormat : "repeat"}));
                return QueryString.stringify(params, {arrayFormat : "repeat"});
            }
        })
        .then(function(response){
            // map함수
            const result = response.data.map(function(one){
                return <p>{one}</p>
            });
            setMessage(result);
        }); //then
    }

    const ajaxbtn5 = function(){
        let playerArray = [];
        let player1 = {"player":"messi", "goal":50};
        let player2 = {"player":"son", "goal":60};
        let player3 = {"player":"kane", "goal":40};

        playerArray.push(player1);
        playerArray.push(player2);
        playerArray.push(player3);
        axios({
            url : "http://localhost:9090/helloajaxobjectarray",
            method : 'post',
            data: {"playerArray" : JSON.stringify(playerArray)}
            
        })
        .then(function(response){
            setMessage( JSON.stringify(response.data) );
        }); //then
    }

    const ajaxbtn6 = async function(){
        let playerArray = [];
        let player1 = {"player":"messi", "goal":50};
        let player2 = {"player":"son", "goal":60};
        let player3 = {"player":"kane", "goal":40};
        playerArray.push(player1);
        playerArray.push(player2);
        playerArray.push(player3);

        let response = 
        await axios.post("http://localhost:9090/helloajaxobjectarray", {"playerArray" : JSON.stringify(playerArray)});
        if (response.data.fullName != "이름모름"){
            let response2 = 
            await axios.post("http://localhost:9090/helloajaxparam", {"id" : response.data.player, "pw" : response.data.goal});
            setMessage("찾은 선수정보 : " + JSON.stringify(response.data) + " , 새롭게 등록 : " + JSON.stringify(response2.data));
        }
    }
    return (
<div>
<h3>서버랑 통신하는 중입니다.</h3>
<h3>아래줄에 서버와의 통신결과를 출력합니다.</h3>
<h3 style={ {color:"white", backgroundColor:"red"} }>{message}</h3>
<input type="button" value="ajax(기본)요청" onClick={ajaxbtn1} />
<input type="button" value="ajax(get파라미터)요청" onClick={ajaxbtn2} />
<input type="button" value="ajax(post파라미터)요청" onClick={ajaxbtn3} />
<input type="button" value="ajax(배열파라미터-GET)요청" onClick={ajaxbtn4} />
<input type="button" value="ajax(객체배열전달있는post)요청" onClick={ajaxbtn5}/>
<input type="button" value="async/await요청" onClick={ajaxbtn6}/>
</div>
    );
}

export default ServerConnection_boot;