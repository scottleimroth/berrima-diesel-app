from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})

# Sample data (replace with database later)
signals = [
    {
        "id": 1,
        "company": "Acme Corp",
        "signal": "Hiring Spree",
        "probability": 0.85,
        "timestamp": "2026-02-01T10:30:00Z"
    },
    {
        "id": 2,
        "company": "TechStart Inc",
        "signal": "New Office Opening",
        "probability": 0.72,
        "timestamp": "2026-02-02T14:15:00Z"
    }
]

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

@app.route("/api/signals", methods=["GET"])
def get_signals():
    return jsonify(signals), 200

@app.route("/api/signals/<int:signal_id>", methods=["GET"])
def get_signal(signal_id):
    signal = next((s for s in signals if s["id"] == signal_id), None)
    if signal:
        return jsonify(signal), 200
    return jsonify({"error": "Signal not found"}), 404

@app.route("/api/signals", methods=["POST"])
def create_signal():
    data = request.get_json()
    new_signal = {
        "id": max([s["id"] for s in signals]) + 1 if signals else 1,
        "company": data.get("company"),
        "signal": data.get("signal"),
        "probability": data.get("probability"),
        "timestamp": data.get("timestamp")
    }
    signals.append(new_signal)
    return jsonify(new_signal), 201

if __name__ == "__main__":
    app.run(debug=True, port=5000)
