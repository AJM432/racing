import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus, faNewspaper } from "@fortawesome/free-solid-svg-icons";

const BottomBar = ({ pageViewing, setPageViewing }) => {
  const buttons = [
    { name: "account", icon: faUser },
    { name: "add", icon: faPlus },
    { name: "feed", icon: faNewspaper },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-full shadow-2xl px-6 py-3 flex justify-between w-3/4 max-w-md border border-gray-700 z-50">
      {buttons.map((btn) => (
        <button
          key={btn.name}
          onClick={() => setPageViewing(btn.name)}
          className={`
            flex flex-col items-center justify-center
            w-16 h-16
            rounded-full
            transition-all duration-300
            ${
              pageViewing === btn.name
                ? "bg-gradient-to-tr from-cyan-400 to-blue-500 text-white shadow-[0_0_20px_rgba(0,255,255,0.6)] scale-110"
                : "text-gray-400 hover:text-cyan-400 hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            }
          `}
        >
          <FontAwesomeIcon icon={btn.icon} className="w-6 h-6" />
          <span className="text-xs font-semibold mt-1 capitalize">{btn.name}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomBar;
