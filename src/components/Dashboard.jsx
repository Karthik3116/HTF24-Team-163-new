
// components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ videoChats }) {
  const navigate = useNavigate();

  if (videoChats.length === 0) {
    return <p>No Data Found.</p>;
  }

  return (
    <div className="dashboard">
      <h2>Available Video Chat Summarization Rooms</h2>
      {videoChats.map((chat, index) => (
        <div key={index} className="video-chat-card">
          <p>Room Name: {chat.name}</p> {/* Display room name instead of video URL */}
          <button onClick={() => navigate(`/chat/${index}`)}>Chat now</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
