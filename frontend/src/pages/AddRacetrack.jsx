import React from "react";
import Cookies from "js-cookie";
import RacetrackCanvas from "../components/RacetrackCanvas";

const API_URL = process.env.REACT_APP_API_URL;

const AddRacetrack = () => {
    const saveRacetrack = async (dataUrl) => {
        // Get username from cookie or default
        const username = Cookies.get("username") || "anon goose";

        try {
            const response = await fetch(`${API_URL}/api/racetracks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: "test",
                    image: dataUrl,
                    username: username,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to save racetrack: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Racetrack saved successfully:", result);
        } catch (error) {
            console.error("Error saving racetrack:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Add a Racetrack</h1>
            <RacetrackCanvas saveRacetrack={saveRacetrack} />
        </div>
    );
};

export default AddRacetrack;
