"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userIP, setUserIP] = useState(""); // Store user's IP

  // Fetch user's IP address when the component loads
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        setUserIP(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };
    fetchIP();
  }, []);

  const claimCoupon = async () => {
    setLoading(true);
    setIsError(false);

    try {
      const response = await axios.post(
        "https://coupon-backend-1-4nih.onrender.com/api/coupons/claim",
        { ip: userIP } // Send IP in request body
      );
      setMessage(response.data.message);
      setCoupon(response.data.couponCode || null);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Error claiming coupon. Please try again."
      );
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Claim Your Coupon 🎉
        </h1>
        <button
          onClick={claimCoupon}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Claiming...
            </div>
          ) : (
            "Get Coupon"
          )}
        </button>
        {message && (
          <p
            className={`mt-6 text-lg font-semibold animate-fade-in ${
              isError ? "text-red-600" : "text-gray-700"
            }`}
          >
            {message}
          </p>
        )}
        {coupon && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg animate-fade-in">
            <p className="text-xl text-green-700 font-bold">
              Coupon Code: <span className="underline">{coupon}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
