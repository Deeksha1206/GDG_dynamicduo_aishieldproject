import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling
import "animate.css"; // Animations

function App() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true); // Show loading animation

    try {
      const response = await axios.post("http://127.0.0.1:5000/moderate", {
        text: inputText,
      });

      console.log("API Response:", response.data);
      setResponseText(response.data);
    } catch (error) {
      console.error("Error calling API:", error);
      setErrorMessage("⚠️ Failed to contact server. Check if Flask is running.");
    }

    setLoading(false); // Hide loading animation
  };

  const handleClear = () => {
    setInputText("");
    setResponseText(null);
    setErrorMessage("");
  };

  // Function to determine Bootstrap alert classes based on classification
  const getClassificationStyle = (category) => {
    if (category === "safe") return "alert alert-success animate__animated animate__fadeIn";
    if (category === "mild") return "alert alert-warning animate__animated animate__shakeX";
    if (category === "severe") return "alert alert-danger animate__animated animate__flash";
    return "alert alert-secondary animate__animated animate__fadeIn";
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container">
        <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <h1 className="text-center text-primary mb-3 animate__animated animate__fadeInDown">
            AI Shield - Text Moderation
          </h1>

          {/* Textarea Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text..."
            className="form-control mb-3"
            rows="4"
          />
          
          {/* Character Counter */}
          <p className="text-muted text-end">{inputText.length} / 500</p>

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button onClick={handleSubmit} className="btn btn-primary w-100">
              Analyze
            </button>
            <button onClick={handleClear} className="btn btn-secondary">
              Clear
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Analyzing...</span>
              </div>
            </div>
          )}

          {/* Display API response with classification */}
          {responseText && !loading && (
            <div className={`${getClassificationStyle(responseText.category)} mt-3`} role="alert">
              {responseText.category === "safe" && "✅ Content is Safe. Green Signal!"}
              {responseText.category === "mild" && "⚠️ Warning! Inappropriate Content Detected."}
              {responseText.category === "severe" && "🚨 Severe Content Detected! User details sent to Cyber Crime Department."}
              <p className="mt-2"><strong>Text:</strong> {responseText.text}</p>
            </div>
          )}

          {/* Display error message if API fails */}
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
