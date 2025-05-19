import React from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-5xl font-bold mb-4">Welcome to MindMeld</h1>
      <p className="text-lg max-w-md text-center mb-8">
        Connect with friends and guess the words to find matches!
      </p>
      <p className="text-sm text-gray-600">
        Connecting to server...
      </p>
    </div>
  );
}
