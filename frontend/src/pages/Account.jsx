import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Account = () => {
  const [username, setUsername] = useState("");

  // Load initial username from cookie
  useEffect(() => {
    const savedUsername = Cookies.get("username") || "";
    setUsername(savedUsername);
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSave = () => {
    Cookies.set("username", username, { expires: 365 }); // 1 year expiration
    alert("Username updated!");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col space-y-4">
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
    </div>
  );
};

export default Account;
