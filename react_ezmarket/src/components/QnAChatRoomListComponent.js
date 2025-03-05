import axios from "axios";
import { useState, useEffect } from 'react';
import QnAChatComponent from "./QnAChatComponent";

const QnAChatRoomListComponent = (props) => {

    const product_id = props.product?.product_id;

    const [memberIdList, setMemberIdList] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState(null); // 클릭한 memberId 저장
    const isSeller = props.isSeller;

    useEffect(() => {

        axios({
            url : `http://localhost:9090/chatroom/getmemberlistinchatroom?productId=${product_id}`,
            method : 'GET',
        })
        .then(function(res){
            setMemberIdList(res.data);
        })

    }, [product_id])

    const handleMemberClick = (memberId) => {
        setSelectedMemberId(memberId);
    };


    return (
        <div>
          <h4>판매자 문의 관리</h4>
          <p>구매자들의 문의 채팅방 목록입니다.</p>
          
          {memberIdList.map((memberId) => {
            return (
              <div key={memberId.member_id} onClick={() => handleMemberClick(memberId.member_id)}>
                {memberId.member_id}
              </div>
            );
          })}
    
          {selectedMemberId && (
            <QnAChatComponent memberId={selectedMemberId} isSeller={isSeller} product={props.product}/>
          )}
        </div>
    );
};

export default QnAChatRoomListComponent;