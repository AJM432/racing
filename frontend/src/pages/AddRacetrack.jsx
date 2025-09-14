import React, { useState } from "react";
import Cookies from "js-cookie";
import RacetrackCanvas from "../components/RacetrackCanvas";

const API_URL = process.env.REACT_APP_API_URL;

const AddRacetrack = () => {
    const [title, setTitle] = useState("");
    const [canvasData, setCanvasData] = useState(null);
    const [startPos, setStartPos] = useState([0,0])
    const [racetrack, setRacetrack] = useState(null); 

    const saveRacetrack = async () => {
        if (!title || !canvasData) return;

        const username = Cookies.get("username") || "anon goose";
        const isUpdate = !!racetrack?.id;

        try {
            const response = await fetch(
                isUpdate
                    ? `${API_URL}/api/racetracks/${racetrack.id}`
                    : `${API_URL}/api/racetracks`,
                {
                    method: isUpdate ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: title,
                        image: canvasData,
                        username
                    }),
                }
            );

            if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
            const result = await response.json();

            // store latest racetrack data from backend
            setRacetrack(result.racetrack);
            console.log(isUpdate ? "Racetrack updated:" : "Racetrack created:", result.racetrack);
        } catch (error) {
            console.error("Error saving racetrack:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
            <h1 className="text-3xl font-bold text-white">
                {racetrack?.id ? "Edit Racetrack" : "Add a Racetrack"}
            </h1>

            {/* Title Input */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter racetrack title..."
                className="px-4 py-2 rounded-lg w-full max-w-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
            />

            {/* Canvas */}
            <RacetrackCanvas onCanvasChange={(_canvasData, _startPos) => {setCanvasData(_canvasData); setStartPos(_startPos)}} />

            {/* Save Button */}
            <button
                onClick={saveRacetrack}
                disabled={!title}
                className={`px-8 py-3 rounded-full font-bold shadow-lg transform transition-transform ${
                    title
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-110 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]"
                        : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
            >
                {racetrack?.id ? "Update Racetrack" : "Save Racetrack"}
            </button>
        </div>
    );
};

export default AddRacetrack;
