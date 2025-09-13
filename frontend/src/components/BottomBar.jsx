import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus, faNewspaper } from "@fortawesome/free-solid-svg-icons";

const BottomBar = ({ setPageViewing }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md">
            <div className="flex justify-around py-3">
                <button
                    onClick={() => setPageViewing("account")}
                    className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
                >
                    <FontAwesomeIcon icon={faUser} className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Account</span>
                </button>

                <button
                    onClick={() => setPageViewing("add")}
                    className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
                >
                    <FontAwesomeIcon icon={faPlus} className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Add</span>
                </button>

                <button
                    onClick={() => setPageViewing("feed")}
                    className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
                >
                    <FontAwesomeIcon icon={faNewspaper} className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Feed</span>
                </button>
            </div>
        </div>
    );
};

export default BottomBar;
