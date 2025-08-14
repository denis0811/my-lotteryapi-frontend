import React, { useState, useEffect } from 'react';

// Main App component
export default function App() {
  const [mainNumbers, setMainNumbers] = useState([]);
  const [luckyStars, setLuckyStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch lottery numbers from the API
  const fetchLotteryNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      // THIS is the crucial change. We use the correct backend URL.
      // The backend must be configured to allow CORS requests from your frontend domains.
      const response = await fetch('https://lottery-fastapi-backend.onrender.com/api/lottery-numbers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch lottery numbers.');
      }
      const data = await response.json();
      // The API now returns two keys: main_numbers and lucky_stars
      setMainNumbers(data.main_numbers);
      setLuckyStars(data.lucky_stars);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch numbers when the component first mounts
  useEffect(() => {
    fetchLotteryNumbers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-white/20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in">EuroMillions Number Generator</h1>
        <p className="text-lg sm:text-xl font-light mb-8 opacity-90 animate-fade-in-delay">Powered by a Python API</p>

        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-indigo-200 border-opacity-50"></div>
          </div>
        ) : error ? (
          <div className="text-red-300 font-semibold text-lg mb-8">
            Error: {error}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Main Numbers</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {mainNumbers.map((number, index) => (
                <div
                  key={index}
                  className="bg-white text-purple-600 font-bold text-3xl sm:text-4xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer"
                >
                  {number}
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-semibold mb-4">Lucky Stars</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {luckyStars.map((number, index) => (
                <div
                  key={index}
                  className="bg-purple-800 text-white font-bold text-3xl sm:text-4xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer"
                >
                  {number}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={fetchLotteryNumbers}
          disabled={loading}
          className={`
            w-full py-4 px-8 font-bold rounded-full text-lg sm:text-xl
            transition-all duration-300 ease-in-out
            shadow-lg transform hover:scale-105
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50'}
          `}
        >
          {loading ? 'Fetching...' : 'Generate New Numbers'}
        </button>
      </div>
    </div>
  );
}
