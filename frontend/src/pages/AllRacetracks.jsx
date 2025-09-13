import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL; 

const AllRacetracks = () => {
    const [racetracks, setRacetracks] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRacetracks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/racetracks`, { method: "GET" });
            if (!response.ok) {
                throw new Error(`Error fetching racetracks: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data);
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
        return <div className="text-center mt-10 text-gray-500">Loading racetracks...</div>;
    }

    if (racetracks.length === 0) {
        return <div className="text-center mt-10 text-gray-500">No racetracks found.</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">All Racetracks</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {racetracks.map((track) => (
                    <div
                        key={track.id || track.name}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        <img
                            src={`${API_URL}/${track.saved_file}`}
                            alt={track.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">{track.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllRacetracks;
