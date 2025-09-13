import React, { useRef, useState, useEffect } from "react";

const RacecarCanvas = ({ saveRacetrack }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Redraw saved paths
    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paths.forEach((pathDataUrl) => {
        const img = new Image();
        img.src = pathDataUrl;
        img.onload = () => ctx.drawImage(img, 0, 0);
      });
    };

    redraw();
  }, [paths]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
    setCurrentPath(new Path2D());
    currentPath?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#0FF"; // Neon cyan for futuristic look
    ctx.lineCap = "round";
    ctx.shadowBlur = 0; // No blur, crisp strokes

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    currentPath?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.closePath();
    setIsDrawing(false);

    const dataUrl = canvas.toDataURL();
    setPaths((prev) => [...prev, dataUrl]);
  };

  const handleUndo = () => {
    setPaths((prev) => {
      const newPaths = prev.slice(0, -1);
      const canvas = canvasRef.current;
      if (!canvas) return newPaths;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      newPaths.forEach((pathDataUrl) => {
        const img = new Image();
        img.src = pathDataUrl;
        img.onload = () => ctx.drawImage(img, 0, 0);
      });

      return newPaths;
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveRacetrack(canvas.toDataURL());
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <canvas
        ref={canvasRef}
        className="border-4 border-gray-700 rounded-2xl bg-gray-800 cursor-crosshair w-full max-w-3xl shadow-lg"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex space-x-6">
        <button
          onClick={handleUndo}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black font-bold rounded-full shadow-lg transform transition-transform hover:scale-110 hover:shadow-[0_0_25px_rgba(255,255,0,0.7)]"
        >
          Undo
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg transform transition-transform hover:scale-110 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default RacecarCanvas;
