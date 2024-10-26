
// components/ChatPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ChatPage({ videoChats }) {
  const { index } = useParams();
  const currentChat = videoChats[index];
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  if (!currentChat) {
    return <p>No History Found.</p>;
  }

  // Function to extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null; // Return video ID or null if not found
  };

  const videoId = getVideoId(currentChat.url); // Extract video ID safely

  // Handle sending a chat question
  const handleSendQuestion = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/chat_with_summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: userQuestion,
        summary: currentChat.summary,
      }),
    });

    const result = await response.json();
    const newChatEntry = { question: userQuestion, answer: result.answer };

    setChatHistory([...chatHistory, newChatEntry]);
    setUserQuestion(''); // Clear input after sending the message
  };

  return (
    <div className="chat-page-container">
      <div className="chat-ui">
        {videoId ? (
          <iframe
            width="700"
            height="400"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Video ID not found. Please check the video link.</p>
        )}

        <div className="chat-summary-box">
          <h3>Video Summary</h3>
          <p>{currentChat.summary}</p>
        </div>

        <div className="chat-section">
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-entry">
                <p><strong>You:</strong> {chat.question}</p>
                <p><strong>AI:</strong> {chat.answer}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendQuestion}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              required
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
