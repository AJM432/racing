from flask import Flask, jsonify, request
import base64
import uuid
import os
from datetime import datetime
from image_to_svg import png_to_svg
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes on the app

# Hashmap to store racetrack images and their metadata
racetracks = {}

# Create images directory if it doesn't exist
IMAGES_DIR = 'saved_images'
if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR)

# Utility function to parse base64 image, save to file, and convert to SVG
def save_base64_image_as_svg(base64_string, racetrack_id):
    try:
        # Remove data URL prefix if present (e.g., "data:image/png;base64,")
        if ',' in base64_string:
            base64_data = base64_string.split(',')[1]
        else:
            base64_data = base64_string
        
        # Decode base64 to binary data
        image_data = base64.b64decode(base64_data)
        
        # Save temporary PNG file
        temp_png_filename = f"{racetrack_id}_temp.png"
        temp_png_filepath = os.path.join(IMAGES_DIR, temp_png_filename)
        with open(temp_png_filepath, 'wb') as f:
            f.write(image_data)
        
        # Convert PNG to SVG
        svg_filename = f"{racetrack_id}.svg"
        svg_filepath = os.path.join(IMAGES_DIR, svg_filename)
        
        png_to_svg(temp_png_filepath, svg_filepath, colormode="color", mode="spline")
        
        # Remove temporary PNG file
        if os.path.exists(temp_png_filepath):
            os.remove(temp_png_filepath)
        
        return svg_filepath
    except Exception as e:
        print(f"Error converting image to SVG: {e}")
        # Clean up temp file if it exists
        temp_png_filepath = os.path.join(IMAGES_DIR, f"{racetrack_id}_temp.png")
        if os.path.exists(temp_png_filepath):
            os.remove(temp_png_filepath)
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
    
    # Generate unique ID for the racetrack
    racetrack_id = str(uuid.uuid4())
    
    # Convert image to SVG and save to disk
    saved_svg_filepath = save_base64_image_as_svg(data['image'], racetrack_id)
    
    if not saved_svg_filepath:
        return jsonify({"error": "Failed to convert image to SVG"}), 500
    
    # Store racetrack data in hashmap
    racetracks[racetrack_id] = {
        "id": racetrack_id,
        "name": data['name'],
        "image": data['image'],  # Base64 encoded image data
        "saved_file": saved_svg_filepath,  # Path to saved SVG file
        "uploaded_at": datetime.now().isoformat()
    }
    
    return jsonify({
        "message": "Racetrack uploaded successfully",
        "racetrack": {
            "id": racetrack_id,
            "name": data['name'],
            "saved_file": saved_svg_filepath,
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
    
    # Remove old SVG file if it exists
    old_file_path = existing_racetrack.get("saved_file")
    if old_file_path and os.path.exists(old_file_path):
        try:
            os.remove(old_file_path)
        except Exception as e:
            print(f"Warning: Could not remove old file {old_file_path}: {e}")
    
    # Convert new image to SVG and save to disk
    saved_svg_filepath = save_base64_image_as_svg(data['image'], racetrack_id)
    
    if not saved_svg_filepath:
        return jsonify({"error": "Failed to convert image to SVG"}), 500
    
    # Update racetrack data in hashmap
    racetracks[racetrack_id].update({
        "image": data['image'],  # New base64 encoded image data
        "saved_file": saved_svg_filepath,  # New SVG file path
        "updated_at": datetime.now().isoformat()
    })
    
    return jsonify({
        "message": "Racetrack image updated successfully",
        "racetrack": {
            "id": racetrack_id,
            "name": existing_racetrack["name"],
            "saved_file": saved_svg_filepath,
            "uploaded_at": existing_racetrack["uploaded_at"],
            "updated_at": racetracks[racetrack_id]["updated_at"]
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)