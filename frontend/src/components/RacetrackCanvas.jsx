import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

const RacetrackCanvas = ({ onCanvasChange }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [paths, setPaths] = useState([]); // stores arrays of points
    const [currentPath, setCurrentPath] = useState([]); // track path being drawn

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 600;

        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // redraw all paths
        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#FF0";
        paths.forEach(path => {
            ctx.beginPath();
            path.forEach(([x, y], i) => {
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });

        // inform parent of current canvas snapshot
        onCanvasChange(canvas.toDataURL());
    }, [paths, onCanvasChange]);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setIsDrawing(true);
        setCurrentPath([[offsetX, offsetY]]);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentPath((prev) => [...prev, [offsetX, offsetY]]);

        const ctx = canvasRef.current.getContext("2d");
        ctx.lineWidth = 40;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#FF0";

        ctx.beginPath();
        const lastPoint = currentPath[currentPath.length - 1];
        if (lastPoint) {
            ctx.moveTo(lastPoint[0], lastPoint[1]);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentPath.length > 0) {
            setPaths((prev) => [...prev, currentPath]);
            setCurrentPath([]);
        }
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
            {/* Undo button */}
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
