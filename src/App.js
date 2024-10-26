

// // App.js
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css';
// import Dashboard from './components/Dashboard';
// import ChatPage from './components/ChatPage';

// function App() {
//   const [videoLink, setVideoLink] = useState('');
//   const [videoChats, setVideoChats] = useState([]); // Stores video chats with summaries
//   const [loading, setLoading] = useState(false);
//   const [isCreatingRoom, setIsCreatingRoom] = useState(false);
//   const [roomName, setRoomName] = useState(''); // State for room name

//   // Handle YouTube video link submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setIsCreatingRoom(true);

//     try {
//       const response = await fetch('http://localhost:5000/generate_summary', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ url: videoLink }),
//       });

//       const result = await response.json();

//       if (result.summary) {
//         // Create a new chat object with video URL, summary, and room name
//         const newChat = { url: videoLink, summary: result.summary, name: roomName }; // Include room name
//         setVideoChats([...videoChats, newChat]); // Add to videoChats
//         setRoomName(''); // Reset room name
//         setIsCreatingRoom(false);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }

//     setLoading(false);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <header className="App-header">
//           <h1>AskTube: Video Chat Summary</h1>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Enter YouTube video link"
//               value={videoLink}
//               onChange={(e) => setVideoLink(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Enter chat room name"
//               value={roomName}
//               onChange={(e) => setRoomName(e.target.value)}
//               required
//             />
//             <button type="submit" disabled={loading}>
//               {loading ? 'Processing...' : 'Submit'}
//             </button>
//           </form>
//         </header>

//         {isCreatingRoom && (
//           <div className="room-creation-message">
//             <p>Creating a summarizing room, please wait...</p>
//           </div>
//         )}

//         <Routes>
//           <Route path="/" element={<Dashboard videoChats={videoChats} />} />
//           <Route path="/chat/:index" element={<ChatPage videoChats={videoChats} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ChatPage from './components/ChatPage';

function App() {
  const [videoLink, setVideoLink] = useState('');
  const [videoChats, setVideoChats] = useState([]); // Stores video chats with summaries
  const [loading, setLoading] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState(''); // State for room name

  // Handle YouTube video link submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsCreatingRoom(true);

    try {
      const response = await fetch('http://localhost:5000/generate_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoLink }),
      });

      const result = await response.json();

      if (result.summary) {
        // Create a new chat object with video URL, summary, and room name
        const newChat = { url: videoLink, summary: result.summary, name: roomName }; // Include room name
        setVideoChats([...videoChats, newChat]); // Add to videoChats
        setRoomName(''); // Reset room name
        setIsCreatingRoom(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>AskTube: Video Chat Summary</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter YouTube video link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter chat room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
        </header>

        {isCreatingRoom && (
          <div className="room-creation-message">
            <p>Creating a summarizing room, please wait...</p>
            <div className="loading-spinner"></div> {/* Display loading spinner */}
          </div>
        )}

        <Routes>
          <Route path="/" element={<Dashboard videoChats={videoChats} />} />
          <Route path="/chat/:index" element={<ChatPage videoChats={videoChats} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
