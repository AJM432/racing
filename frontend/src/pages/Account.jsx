import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LeaderboardModal from "../components/LeaderboardModal";

const API_URL = process.env.REACT_APP_API_URL;

const Account = () => {
    const [username, setUsername] = useState("");
    const [racetracks, setRacetracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load initial username from cookie
    useEffect(() => {
        const savedUsername = Cookies.get("username") || "";
        setUsername(savedUsername);
        if (savedUsername) {
            fetchUserRacetracks(savedUsername);
        }
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSave = () => {
        Cookies.set("username", username, { expires: 365 }); // 1 year expiration
        alert("Username updated!");
        fetchUserRacetracks(username); // refresh racetracks
    };

    const fetchUserRacetracks = async (user) => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/racetracks/user/${user}`);
            if (!response.ok) {
                throw new Error(`Error fetching racetracks: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data);
            setRacetracks(data.racetracks || []);
        } catch (error) {
            console.error("Failed to load racetracks:", error);
        } finally {
            setLoading(false);
        }
    };

    const openLeaderboard = (track) => {
        setSelectedTrack(track);
        setIsModalOpen(true);
    };

    const closeLeaderboard = () => {
        setSelectedTrack(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

            {/* Username box */}
            <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col space-y-4 mb-10">
                <label className="text-gray-300 font-semibold">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                />
                <button
                    onClick={handleSave}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-full shadow-lg transform transition-transform hover:scale-105"
                >
                    Save Username
                </button>
            </div>

            {/* User Racetracks */}
            <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Your Racetracks</h2>

                {loading ? (
                    <p className="text-gray-400">Loading racetracks...</p>
                ) : racetracks.length === 0 ? (
                    <p className="text-gray-400">No racetracks found. Go make one!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {racetracks.map((track, i) => (
                            <div
                                key={i}
                                onClick={() => openLeaderboard(track)}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/40 transition-shadow cursor-pointer"
                            >
                                <img
                                    src={`${API_URL}/${track.saved_file}`}
                                    alt={track.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{track.name}</h3>
                                    <p className="text-gray-400 text-sm">by {track.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Leaderboard Modal */}
            {isModalOpen && selectedTrack && (
                <LeaderboardModal
                    racetrackId={selectedTrack.id || selectedTrack._id}
                    onClose={closeLeaderboard}
                />
            )}
        </div>
    );
};

export default Account;
