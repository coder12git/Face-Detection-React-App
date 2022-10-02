
import React, { useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
// OLD MODEL
// import * as facemesh from "@tensorflow-models/facemesh";

// NEW MODEL
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";


function App() {
  // Set up references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFaceMesh = async () => {
    const model = facemesh.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "tfjs",
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    };
    const detector = await facemesh.createDetector(model, detectorConfig);
    setInterval(() => {
      detect(detector);
    }, 100);
  };

// Detect function
const detect = async (detector) => {
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  ) {
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const face = await detector.estimateFaces(video);
    console.log(face);

    const ctx = canvasRef.current.getContext("2d");
    requestAnimationFrame(() => {
      drawMesh(face, ctx);
    });
  }
};
// const detect = async (net) => {
//   if (
//     typeof webcamRef.current !== "undefined" &&
//     webcamRef.current !== null &&
//     webcamRef.current.video.readyState === 4
//   ) {
//     // Get Video Properties
//     const video = webcamRef.current.video;
//     const videoWidth = webcamRef.current.video.videoWidth;
//     const videoHeight = webcamRef.current.video.videoHeight;

//     // Set video width
//     webcamRef.current.video.width = videoWidth;
//     webcamRef.current.video.height = videoHeight;

//     // Set canvas width
//     canvasRef.current.width = videoWidth;
//     canvasRef.current.height = videoHeight;

//     // Make Detections
//     // OLD MODEL
//     //       const face = await net.estimateFaces(video);
//     // NEW MODEL
//     const face = await net.estimateFaces({input:video});
//     console.log(face);

//     // Get canvas context
    
//   }
// };

useEffect(() => {
  runFaceMesh();
}, []);


//Original code for landmark
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

//Original code for landmark
export default App;
