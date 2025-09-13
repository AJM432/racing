import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

const RacetrackCanvas = ({ onCanvasChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    // redraw paths
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach((pathDataUrl) => {
      const img = new Image();
      img.src = pathDataUrl;
      img.onload = () => ctx.drawImage(img, 0, 0);
    });

    // inform parent of latest canvas snapshot
    if (canvas) onCanvasChange(canvas.toDataURL());
  }, [paths, onCanvasChange]);

  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#0FF";
    ctx.lineCap = "round";
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    setPaths((prev) => [...prev, canvas.toDataURL()]);
  };

  const handleUndo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  return (
    <div className="relative w-full max-w-3xl">
      <canvas
        ref={canvasRef}
        className="border-4 border-gray-700 rounded-2xl bg-gray-800 cursor-crosshair w-full shadow-lg"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      {/* Undo button in lower-left corner of the canvas */}
      <button
        onClick={handleUndo}
        className="absolute bottom-4 left-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <FontAwesomeIcon icon={faUndo} className="w-6 h-6" />
      </button>
    </div>
  );
};

export default RacetrackCanvas;
