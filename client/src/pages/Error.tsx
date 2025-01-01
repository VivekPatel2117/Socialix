import React from "react";

const Error: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-500">500</h1>
        <h2 className="mt-4 text-2xl font-semibold">Internal Server Error</h2>
        <p className="mt-2 text-gray-600">
          Oops, something went wrong on our end. Please try again after some time.
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
