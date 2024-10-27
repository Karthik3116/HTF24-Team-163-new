
// ChatForEachApp.jsx
import React from 'react';

function ChatForEachApp({ currentChat }) {
  if (!currentChat) return null;

  const handleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(currentChat.summary);
    utterance.lang = 'en-US'; // Set language
    window.speechSynthesis.speak(utterance); // Speak the text
  };

  return (
    <div className="chat-container">
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${currentChat.url.split('v=')[1]}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="chat-box">
        <h3>Video Summary:</h3>
        <p>{currentChat.summary}</p>
        <button onClick={handleSpeech} className="speech-button">
          🎤 Play Summary
        </button>
      </div>
    </div>
  );
}

export default ChatForEachApp;
