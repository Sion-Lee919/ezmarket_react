import axios from "axios";
import { useState, useEffect } from 'react';
import QnAChatComponent from "./QnAChatComponent";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.208.47.23:8911/api";
const BASE_URL = process.env.REACT_APP_URL || "http://13.208.47.23:8911";

const QnAChatRoomListComponent = (props) => {

    const product_id = props.product?.product_id;

    const [memberIdList, setMemberIdList] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const isSeller = props.isSeller;

    useEffect(() => {
        axios({
            url: `${BASE_URL}/chatroom/getmemberlistinchatroom?productId=${product_id}`,
            method: 'GET',
        })
        .then(function (res) {
            setMemberIdList(res.data);
        })
    }, [product_id]);

    const handleMemberClick = (memberId) => {
        setSelectedMemberId(memberId);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {isSeller && (
                <div style={{
                    width: '250px',
                    padding: '10px',
                    borderRight: '2px solid #ccc',
                    height: '80vh',
                    overflowY: 'auto',
                    marginRight: '15px',
                }}>
                    <h4>문의 리스트</h4>

                    {memberIdList.map((memberId) => {
                        return (
                            <div
                                key={memberId.member_id}
                                onClick={() => handleMemberClick(memberId.member_id)}
                                style={{
                                    padding: '10px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s', // 마우스 오버시 효과
                                }}
                            >
                                {memberId.membernickname}
                            </div>
                        );
                    })}
                </div>
            )}

            <div style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                {selectedMemberId && (
                    <QnAChatComponent
                        memberId={selectedMemberId}
                        isSeller={isSeller}
                        product={props.product}
                    />
                )}
            </div>
        </div>
    );
};

export default QnAChatRoomListComponent;