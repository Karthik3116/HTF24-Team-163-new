
// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import DOMPurify from 'dompurify'; // To sanitize HTML strings

// function ChatPage({ videoChats }) {
//   const { index } = useParams();
//   const currentChat = videoChats[index];
//   const [userQuestion, setUserQuestion] = useState('');
//   const [chatHistory, setChatHistory] = useState([]);

//   if (!currentChat) {
//     return <p>No History Found.</p>;
//   }

//   const getVideoId = (url) => {
//     const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
//     const matches = url.match(regex);
//     return matches ? matches[1] : null; 
//   };

//   const videoId = getVideoId(currentChat.url); 

//   // Function to format the API response string
//   const formatResponse = (response) => {
//     // Replace **text** with <strong>text</strong>
//     let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//     // Replace newlines with <br/>
//     formattedResponse = formattedResponse.replace(/\n/g, '<br/>');
//     // Sanitize the string before rendering to prevent XSS attacks
//     return DOMPurify.sanitize(formattedResponse);
//   };

//   const handleSendQuestion = async (e) => {
//     e.preventDefault();

//     const response = await fetch('http://localhost:5000/chat_with_summary', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         question: userQuestion,
//         summary: currentChat.summary,
//       }),
//     });

//     const result = await response.json();
//     const formattedAnswer = formatResponse(result.answer); // Format the response before displaying
//     const newChatEntry = { question: userQuestion, answer: formattedAnswer };

//     setChatHistory([...chatHistory, newChatEntry]);
//     setUserQuestion('');
//   };

//   return (
//     <div className="chat-page-container">
//       <div className="chat-ui">
//         {videoId ? (
//           <iframe
//             width="700"
//             height="400"
//             src={`https://www.youtube.com/embed/${videoId}`}
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>
//         ) : (
//           <p>Video ID not found. Please check the video link.</p>
//         )}

//         <div className="chat-summary-box">
//           <h3>Video Summary</h3>
//           <p>{currentChat.summary}</p>
//         </div>

//         <div className="chat-section">
//           <div className="chat-history">
//             {chatHistory.map((chat, index) => (
//               <div key={index} className="chat-entry">
                
//                 <div className="user-message">
//                   <p><strong>You:</strong> {chat.question}</p>
//                 </div>
//                 {/* <p><strong>You:</strong> {chat.question}</p> */}

//                 {/* Use dangerouslySetInnerHTML to render formatted HTML */}
//                 {/* <p><strong>AI:</strong> <span dangerouslySetInnerHTML={{ __html: chat.answer }} /></p> */}
//                 <div className="ai-message">
//                   <p><strong>AI:</strong> <span dangerouslySetInnerHTML={{ __html: chat.answer }} /></p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <form onSubmit={handleSendQuestion}>
//             <input
//               type="text"
//               placeholder="Ask a question..."
//               value={userQuestion}
//               onChange={(e) => setUserQuestion(e.target.value)}
//               required
//             />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;



import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify'; // To sanitize HTML strings

function ChatPage({ videoChats }) {
  const { index } = useParams();
  const currentChat = videoChats[index];
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  if (!currentChat) {
    return <p>No History Found.</p>;
  }

  const getVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null; 
  };

  const videoId = getVideoId(currentChat.url); 

  // Function to format the API response string
  const formatResponse = (response) => {
    // Replace **text** with <strong>text</strong>
    let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace newlines with <br/>
    formattedResponse = formattedResponse.replace(/\n/g, '<br/>');
    // Sanitize the string before rendering to prevent XSS attacks
    return DOMPurify.sanitize(formattedResponse);
  };

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when sending a question

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
    const formattedAnswer = formatResponse(result.answer); // Format the response before displaying
    const newChatEntry = { question: userQuestion, answer: formattedAnswer };

    setChatHistory([...chatHistory, newChatEntry]);
    setUserQuestion('');
    setLoading(false); // Reset loading after response is received
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
                <div className="user-message">
                  <p><strong>You:</strong> {chat.question}</p>
                </div>
                <div className="ai-message">
                  <p><strong>AI:</strong> <span dangerouslySetInnerHTML={{ __html: chat.answer }} /></p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="loading-spinner">
                {/* Loading spinner shown while waiting for response */}
              </div>
            )}
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
