import React, { useEffect, useState } from "react";
import LeaderboardModal from "../components/LeaderboardModal";

const API_URL = process.env.REACT_APP_API_URL;

const AllRacetracks = () => {
    const [racetracks, setRacetracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    const getRacetracks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/racetracks`, { method: "GET" });
            if (!response.ok) {
                throw new Error(`Error fetching racetracks: ${response.statusText}`);
            }
            const data = await response.json();
            setRacetracks(data.racetracks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRacetracks();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-10 text-gray-400 dark:text-gray-300">
                Loading racetracks...
            </div>
        );
    }

    if (racetracks.length === 0) {
        return (
            <div className="text-center mt-10 text-gray-400 dark:text-gray-300">
                No racetracks found.
            </div>
        );
    }

    return (
        <div className="relative p-6 min-h-screen overflow-hidden">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-white tracking-wide">
                All Racetracks
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
                {racetracks.map((track) => (
                    <div
                        key={track.id || track._id || track.name}
                        onClick={() => setSelectedTrackId(track.id || track._id)}
                        className="cursor-pointer bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-transform transform hover:scale-105"
                    >
                        <img
                            src={`${API_URL}/${track.saved_file}`}
                            alt={track.name}
                            className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-white">{track.name}</h2>
                            <p className="text-sm text-gray-400 mt-1">
                                Submitted by{" "}
                                <span className="font-medium text-cyan-400">
                                    {track.username || "anon goose"}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Leaderboard Modal */}
            {selectedTrackId && (
                <LeaderboardModal
                    racetrackId={selectedTrackId}
                    onClose={() => setSelectedTrackId(null)}
                />
            )}
        </div>
    );
};

export default AllRacetracks;
