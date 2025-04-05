from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows cross-origin requests from React frontend

# Function to classify text
def classify_text(text):
    text = text.lower()

    severe_words = ["kill", "bomb", "terrorist", "attack", "murder"]
    mild_words = ["stupid", "idiot", "hate", "dumb"]

    if any(word in text for word in severe_words):
        return "severe"
    elif any(word in text for word in mild_words):
        return "mild"
    else:
        return "safe"

@app.route("/")
def home():
    return "Flask server is running!"

@app.route("/moderate", methods=["POST"])
def moderate():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Invalid request"}), 400

    user_text = data["text"]
    category = classify_text(user_text)

    return jsonify({
        "message": "Text processed",
        "text": user_text,
        "category": category
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
