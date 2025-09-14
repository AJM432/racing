from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import base64
import uuid
import os
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
ENABLE_DEV = bool(int(os.getenv("ENABLE_DEV_MODE", False)))
ALLOWED_ORIGINS="https://api.artyomg.com"
if ENABLE_DEV:
    ALLOWED_ORIGINS="http://localhost:3000"
app = Flask(__name__)
CORS(app, origins=[ALLOWED_ORIGINS])


# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///racetracks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model for racetracks
class Racetrack(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), nullable=False)
    saved_file = db.Column(db.String(200), nullable=False)
    leaderboard = db.Column(db.Text, nullable=True, default='{}')  # JSON string storing username->time mapping
    uploaded_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self, include_image_url=False, include_leaderboard=False):
        result = {
            'id': self.id,
            'name': self.name,
            'username': self.username,
            'saved_file': self.saved_file,
            'uploaded_at': self.uploaded_at.isoformat()
        }
        if include_image_url:
            # Return URL to access the image instead of base64 data
            filename = os.path.basename(self.saved_file)
            result['image_url'] = f'/saved_images/{filename}'
        if include_leaderboard:
            import json
            try:
                result['leaderboard'] = json.loads(self.leaderboard or '{}')
            except json.JSONDecodeError:
                result['leaderboard'] = {}
        if self.updated_at:
            result['updated_at'] = self.updated_at.isoformat()
        return result

# Create images directory if it doesn't exist
IMAGES_DIR = 'saved_images'
if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR)

# Create database tables
with app.app_context():
    db.create_all()

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
    
    # Create new racetrack record in database
    try:
        new_racetrack = Racetrack(
            id=racetrack_id,
            name=data['name'],
            username=data['username'],
            saved_file=saved_filepath
        )
        db.session.add(new_racetrack)
        db.session.commit()
        
        return jsonify({
            "message": "Racetrack uploaded successfully",
            "racetrack": new_racetrack.to_dict(include_image_url=True)
        }), 201
    except Exception as e:
        db.session.rollback()
        # Clean up saved file if database operation fails
        if os.path.exists(saved_filepath):
            os.remove(saved_filepath)
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Get all racetracks
@app.route('/api/racetracks', methods=['GET'])
def get_racetracks():
    try:
        # Query all racetracks from database
        racetracks = Racetrack.query.all()
        racetracks_list = [racetrack.to_dict(include_image_url=False) for racetrack in racetracks]
        
        return jsonify({"racetracks": racetracks_list})
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Get racetracks by username
@app.route('/api/racetracks/user/<username>', methods=['GET'])
def get_racetracks_by_user(username):
    try:
        # Query racetracks filtered by username
        racetracks = Racetrack.query.filter_by(username=username).all()
        racetracks_list = [racetrack.to_dict(include_image_url=False) for racetrack in racetracks]
        
        return jsonify({
            "username": username,
            "racetracks": racetracks_list,
            "count": len(racetracks_list)
        })
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Get specific racetrack by ID (including image)
@app.route('/api/racetracks/<racetrack_id>', methods=['GET'])
def get_racetrack(racetrack_id):
    try:
        racetrack = Racetrack.query.get(racetrack_id)
        if not racetrack:
            return jsonify({"error": "Racetrack not found"}), 404
        
        return jsonify({"racetrack": racetrack.to_dict(include_image_url=True)})
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Update racetrack image by ID
@app.route('/api/racetracks/<racetrack_id>', methods=['PUT'])
def update_racetrack_image(racetrack_id):
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Validate required field
    if 'image' not in data:
        return jsonify({"error": "Missing 'image' in request"}), 400
    
    try:
        # Get existing racetrack from database
        existing_racetrack = Racetrack.query.get(racetrack_id)
        if not existing_racetrack:
            return jsonify({"error": "Racetrack not found"}), 404
        
        # Remove old image file if it exists
        old_file_path = existing_racetrack.saved_file
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
        
        # Update racetrack data in database
        existing_racetrack.saved_file = saved_filepath
        existing_racetrack.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "message": "Racetrack image updated successfully",
            "racetrack": existing_racetrack.to_dict(include_image_url=True)
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Submit race time for a track
@app.route('/api/racetracks/<racetrack_id>/times', methods=['POST'])
def submit_race_time(racetrack_id):
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    
    # Validate required fields
    if 'username' not in data:
        return jsonify({"error": "Missing 'username' in request"}), 400
    if 'time' not in data:
        return jsonify({"error": "Missing 'time' in request"}), 400
    
    try:
        # Validate time is a positive number
        race_time = float(data['time'])
        if race_time <= 0:
            return jsonify({"error": "Time must be a positive number"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Time must be a valid number"}), 400
    
    try:
        # Get existing racetrack from database
        racetrack = Racetrack.query.get(racetrack_id)
        if not racetrack:
            return jsonify({"error": "Racetrack not found"}), 404
        
        # Parse existing leaderboard
        import json
        try:
            leaderboard = json.loads(racetrack.leaderboard or '{}')
        except json.JSONDecodeError:
            leaderboard = {}
        
        # Update or add user's time (only if it's better than existing time)
        username = data['username']
        is_new_record = username not in leaderboard or race_time < leaderboard[username]
        
        if is_new_record:
            leaderboard[username] = race_time
            racetrack.leaderboard = json.dumps(leaderboard)
            racetrack.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                "message": "Race time submitted successfully",
                "username": username,
                "time": race_time,
                "is_new_record": True
            }), 201
        else:
            return jsonify({
                "message": "Time not improved",
                "username": username,
                "time": race_time,
                "current_best": leaderboard[username],
                "is_new_record": False
            }), 200
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Get leaderboard for a track
@app.route('/api/racetracks/<racetrack_id>/leaderboard', methods=['GET'])
def get_leaderboard(racetrack_id):
    try:
        racetrack = Racetrack.query.get(racetrack_id)
        if not racetrack:
            return jsonify({"error": "Racetrack not found"}), 404
        
        # Parse leaderboard and sort by time
        import json
        try:
            leaderboard = json.loads(racetrack.leaderboard or '{}')
        except json.JSONDecodeError:
            leaderboard = {}
        
        # Convert to sorted list of entries
        sorted_leaderboard = [
            {"username": username, "time": time, "rank": idx + 1}
            for idx, (username, time) in enumerate(sorted(leaderboard.items(), key=lambda x: x[1]))
        ]
        
        return jsonify({
            "racetrack_id": racetrack_id,
            "racetrack_name": racetrack.name,
            "leaderboard": sorted_leaderboard,
            "total_entries": len(sorted_leaderboard)
        })
        
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

if __name__ == '__main__':
    debug_mode = bool(int(os.getenv("DEBUG", False)))

    app.run(host='0.0.0.0', port=5000, debug=debug_mode)