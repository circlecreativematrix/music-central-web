
import * as Tone from 'tone';
import './AllowCookiesAudioPopup.css'
import { useState } from 'react';
const Popup = () => {
  const [showPopup, setShowPopup] = useState(true);

  const handlePlay = async () => {
    await Tone.start();
    console.log("audio is ready");
    setShowPopup(false); // Hides the popup after clicking Play
  };

  return (
    <>
      {showPopup && (
        <div id="popup" >
          <div id="popup-content">
            <h2>Allow Audio</h2>
            <p>Please allow audio to continue.</p>
            <button onClick={handlePlay} id="play-button">
              Play
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Simple inline styles for the popup

export default Popup;
