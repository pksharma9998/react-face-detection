import React, { useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const webcamRef = React.useRef<Webcam>(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImage(imageSrc || null);
  }, [webcamRef]);

  const handleMatch = async () => {
    if (image) {
      try {
        const response = await axios.post('http://localhost:5000/compare-face', {
          image: image
        });
        console.log('response: ', response)
        setMatchResult(response.data.message);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Face Recognition App</h1>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        className="my-5 border"
      />
      <button onClick={capture} className="bg-blue-500 text-white p-3 rounded">
        Capture Image
      </button>
      {image && (
        <div>
          <img src={image} alt="Captured" className="my-5 border" />
          <button
            onClick={handleMatch}
            className="bg-green-500 text-white p-3 rounded"
          >
            Match Face
          </button>
        </div>
      )}
      {matchResult && <p className="text-xl font-bold mt-4">{matchResult}</p>}
    </div>
  );
};

export default App;
