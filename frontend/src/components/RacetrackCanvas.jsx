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

        ctx.lineWidth = 4;
        ctx.strokeStyle = "#EF4444"; // Tailwind red-500
        ctx.lineCap = "round";

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

        // Save current canvas as data URL for undo
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
        <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-lg shadow-lg">
            <canvas
                ref={canvasRef}
                className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            <div className="flex space-x-4">
                <button
                    onClick={handleUndo}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg shadow"
                >
                    Undo
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default RacecarCanvas;
