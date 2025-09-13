import { useState } from "react";
import BottomBar from "./components/BottomBar";
import AddRacetrack from "./pages/AddRacetrack";
import AllRacetracks from "./pages/AllRacetracks";
import Account from "./pages/Account";
import "./App.css"; // keep for any global styles

function App() {
  const [pageViewing, setPageViewing] = useState("feed");

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden bg-gray-900 dark:bg-gray-900 p-10">
      {/* Futuristic animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-purple-900 to-indigo-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 animate-gradient-x opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,255,255,0.05)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(0,255,255,0.05)_0%,_transparent_70%)] animate-pulse pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10">
        {pageViewing === "feed" && <AllRacetracks />}
        {pageViewing === "add" && <AddRacetrack />}
        {pageViewing === "account" && <Account />}
      </div>

      {/* Bottom bar */}
      <BottomBar pageViewing={pageViewing} setPageViewing={setPageViewing} />
    </div>
  );
}

export default App;
