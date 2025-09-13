from flask import Flask, jsonify, request
import base64
import uuid
from datetime import datetime

app = Flask(__name__)

# Hashmap to store racetrack images and their metadata
racetracks = {}

# Root endpoint
@app.route('/')
def home():
    return "Welcome to the Racetrack API!"

# Upload racetrack image with name
@app.route('/api/racetracks', methods=['POST'])
def upload_racetrack():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Validate required fields
    if 'name' not in data:
        return jsonify({"error": "Missing 'name' in request"}), 400
    if 'image' not in data:
        return jsonify({"error": "Missing 'image' in request"}), 400
    
    # Generate unique ID for the racetrack
    racetrack_id = str(uuid.uuid4())
    
    # Store racetrack data in hashmap
    racetracks[racetrack_id] = {
        "id": racetrack_id,
        "name": data['name'],
        "image": data['image'],  # Base64 encoded image data
        "uploaded_at": datetime.now().isoformat()
    }
    
    return jsonify({
        "message": "Racetrack uploaded successfully",
        "racetrack": {
            "id": racetrack_id,
            "name": data['name'],
            "uploaded_at": racetracks[racetrack_id]["uploaded_at"]
        }
    }), 201

# Get all racetracks
@app.route('/api/racetracks', methods=['GET'])
def get_racetracks():
    # Return racetracks without image data for performance
    racetracks_list = []
    for racetrack_id, racetrack in racetracks.items():
        racetracks_list.append({
            "id": racetrack["id"],
            "name": racetrack["name"],
            "uploaded_at": racetrack["uploaded_at"]
        })
    
    return jsonify({"racetracks": racetracks_list})

# Get specific racetrack by ID (including image)
@app.route('/api/racetracks/<racetrack_id>', methods=['GET'])
def get_racetrack(racetrack_id):
    if racetrack_id not in racetracks:
        return jsonify({"error": "Racetrack not found"}), 404
    
    return jsonify({"racetrack": racetracks[racetrack_id]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
