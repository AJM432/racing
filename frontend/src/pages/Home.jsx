import React from "react";
import RacetrackCanvas from "../components/RacetrackCanvas";

const API_URL = process.env.REACT_APP_API_URL;

const HomePage = () => {

    const getRacetracks = async (dataUrl) => {
        try{
            const response = await fetch(`${API_URL}/api/racetracks`, { method: "GET"});
            console.log(response)
        } catch(error){
            console.error(error)
        }
    }
 
    const saveRacetrack = async (dataUrl) => {
        try {
          const response = await fetch(`${API_URL}/api/racetracks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "test",       // racetrack name
              image: dataUrl,     // canvas as base64 image
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

    return(
        <div>
            <RacetrackCanvas saveRacetrack={saveRacetrack}/>
        </div>
    );
}

export default HomePage;
