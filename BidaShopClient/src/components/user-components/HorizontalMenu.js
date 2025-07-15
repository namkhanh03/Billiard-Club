import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HorizontalMenu.css";

const HorizontalMenu = () => {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();

  const handleViewSubscription = () => {
    navigate(`/userSubscription/${subscriptionId}`);
  };

  const handleViewSchedule = () => {
    navigate(`/userSchedule/${subscriptionId}`);
  };

  const handleViewSurvey = () => {
    navigate(`/userSurvey/${subscriptionId}`);
  };

  const handleOpenChatRoom = () => {
    navigate(`/chatRoom/${subscriptionId}`);
  };

  return (
    <div className="horizontal-menu">
      <ul>
        {/* <li onClick={handleViewSubscription}>Course Details</li> */}
        <li onClick={handleViewSchedule}>View Schedule</li>
        <li onClick={handleViewSurvey}>View Survey</li>
        {/* <li onClick={handleOpenChatRoom}>Open Chat Room</li> */}
      </ul>
    </div>
  );
};

export default HorizontalMenu;
