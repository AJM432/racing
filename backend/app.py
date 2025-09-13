from flask import Flask, jsonify, request, send_from_directory
import base64
import uuid
import os
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes on the app

# Hashmap to store racetrack images and their metadata
racetracks = {}

# Create images directory if it doesn't exist
IMAGES_DIR = 'saved_images'
if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR)

@app.route('/saved_images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

# Utility function to parse base64 image and save to file
def save_base64_image(base64_string, filename):
    try:
        # Remove data URL prefix if present (e.g., "data:image/png;base64,")
        if ',' in base64_string:
            base64_data = base64_string.split(',')[1]
        else:
            base64_data = base64_string
        
        # Decode base64 to binary data
        image_data = base64.b64decode(base64_data)
        
        # Save to file
        filepath = os.path.join(IMAGES_DIR, filename)
        with open(filepath, 'wb') as f:
            f.write(image_data)
        
        return filepath
    except Exception as e:
        print(f"Error saving image: {e}")
        return None

# Utility function to get file extension from base64 data URL
def get_extension_from_base64(base64_string):
    if base64_string.startswith('data:image/'):
        mime_type = base64_string.split(';')[0].split(':')[1]
        extensions = {
            'image/png': '.png',
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/gif': '.gif',
            'image/bmp': '.bmp',
            'image/webp': '.webp'
        }
        return extensions.get(mime_type, '.png')
    return '.png'

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
    if 'username' not in data:
        return jsonify({"error": "Missing 'username' in request"}), 400
    
    # Generate unique ID for the racetrack
    racetrack_id = str(uuid.uuid4())
    
    # Generate filename and save image to disk
    file_extension = get_extension_from_base64(data['image'])
    filename = f"{racetrack_id}{file_extension}"
    saved_filepath = save_base64_image(data['image'], filename)
    
    if not saved_filepath:
        return jsonify({"error": "Failed to save image"}), 500
    
    # Store racetrack data in hashmap
    racetracks[racetrack_id] = {
        "id": racetrack_id,
        "name": data['name'],
        "username": data['username'],
        "image": data['image'],  # Base64 encoded image data
        "saved_file": saved_filepath,  # Path to saved image file
        "uploaded_at": datetime.now().isoformat()
    }
    
    return jsonify({
        "message": "Racetrack uploaded successfully",
        "racetrack": {
            "id": racetrack_id,
            "name": data['name'],
            "username": data['username'],
            "saved_file": saved_filepath,
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
            "username": racetrack["username"],
            "saved_file": racetrack["saved_file"],
            "uploaded_at": racetrack["uploaded_at"]
        })
    
    return jsonify({"racetracks": racetracks_list})

# Get specific racetrack by ID (including image)
@app.route('/api/racetracks/<racetrack_id>', methods=['GET'])
def get_racetrack(racetrack_id):
    if racetrack_id not in racetracks:
        return jsonify({"error": "Racetrack not found"}), 404
    
    return jsonify({"racetrack": racetracks[racetrack_id]})

# Update racetrack image by ID
@app.route('/api/racetracks/<racetrack_id>', methods=['PUT'])
def update_racetrack_image(racetrack_id):
    if racetrack_id not in racetracks:
        return jsonify({"error": "Racetrack not found"}), 404
    
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Validate required field
    if 'image' not in data:
        return jsonify({"error": "Missing 'image' in request"}), 400
    
    # Get existing racetrack
    existing_racetrack = racetracks[racetrack_id]
    
    # Remove old image file if it exists
    old_file_path = existing_racetrack.get("saved_file")
    if old_file_path and os.path.exists(old_file_path):
        try:
            os.remove(old_file_path)
        except Exception as e:
            print(f"Warning: Could not remove old file {old_file_path}: {e}")
    
    # Generate filename and save new image to disk
    file_extension = get_extension_from_base64(data['image'])
    filename = f"{racetrack_id}{file_extension}"
    saved_filepath = save_base64_image(data['image'], filename)
    
    if not saved_filepath:
        return jsonify({"error": "Failed to save image"}), 500
    
    # Update racetrack data in hashmap
    racetracks[racetrack_id].update({
        "image": data['image'],  # New base64 encoded image data
        "saved_file": saved_filepath,  # New image file path
        "updated_at": datetime.now().isoformat()
    })
    
    return jsonify({
        "message": "Racetrack image updated successfully",
        "racetrack": {
            "id": racetrack_id,
            "name": existing_racetrack["name"],
            "username": existing_racetrack["username"],
            "saved_file": saved_filepath,
            "uploaded_at": existing_racetrack["uploaded_at"],
            "updated_at": racetracks[racetrack_id]["updated_at"]
        }
    })

if __name__ == '__main__':
    load_dotenv()
    debug_mode = bool(int(os.getenv("DEBUG", False)))

    app.run(host='0.0.0.0', port=5000, debug=debug_mode)