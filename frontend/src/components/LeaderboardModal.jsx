import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const LeaderboardModal = ({ racetrackId, onClose }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [racetrackName, setRacetrackName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!racetrackId) return;

        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${API_URL}/api/racetracks/${racetrackId}/leaderboard`);
                if (!response.ok) {
                    throw new Error(`Error fetching leaderboard: ${response.statusText}`);
                }
                const data = await response.json();
                setLeaderboard(data.leaderboard || []);
                setRacetrackName(data.racetrack_name || "Unknown Track");
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [racetrackId]);

    if (!racetrackId) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-gray-900 text-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl z-10 border border-cyan-400/30">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Leaderboard - {racetrackName}
                </h2>

                {loading ? (
                    <p className="text-center text-gray-400">Loading leaderboard...</p>
                ) : leaderboard.length === 0 ? (
                    <p className="text-center text-gray-400">No entries yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-cyan-400 text-left border-b border-gray-700">
                                    <th className="p-3">Rank</th>
                                    <th className="p-3">Username</th>
                                    <th className="p-3">Time (s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry) => (
                                    <tr
                                        key={entry.rank}
                                        className="hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="p-3 font-bold text-cyan-300">#{entry.rank}</td>
                                        <td className="p-3">{entry.username}</td>
                                        <td className="p-3">{entry.time.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardModal;
