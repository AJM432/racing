# Racetrack API

## Endpoints

### GET `/`
Returns welcome message.

### POST `/api/racetracks`
Upload a racetrack image.

**Request:**
```json
{
  "name": "Monaco Grand Prix",
  "username": "john_doe",
  "image": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "message": "Racetrack uploaded successfully",
  "racetrack": {
    "id": "abc1232039023",
    "name": "Monaco Grand Prix",
    "username": "john_doe",
    "saved_file": "saved_images/abc1232039023.png",
    "uploaded_at": "2025-09-13T13:45:02",
    "image_url": "/saved_images/abc1232039023.png"
  }
}
```

### GET `/api/racetracks`
Get all racetracks.

**Response:**
```json
{
  "racetracks": [
    {
      "id": "abc1232039023",
      "name": "Monaco Grand Prix",
      "username": "john_doe",
      "saved_file": "saved_images/abc1232039023.png",
      "uploaded_at": "2025-09-13T13:45:02"
    }
  ]
}
```

### GET `/api/racetracks/user/<username>`
Get all racetracks for a specific user.

**Response:**
```json
{
  "username": "john_doe",
  "racetracks": [
    {
      "id": "abc1232039023",
      "name": "Monaco Grand Prix",
      "username": "john_doe",
      "saved_file": "saved_images/abc1232039023.png",
      "uploaded_at": "2025-09-13T13:45:02"
    }
  ],
  "count": 1
}
```

### GET `/api/racetracks/<id>`
Get specific racetrack with image URL.

**Response:**
```json
{
  "racetrack": {
    "id": "abc1232039023",
    "name": "Monaco Grand Prix",
    "username": "john_doe",
    "saved_file": "saved_images/abc1232039023.png",
    "uploaded_at": "2025-09-13T13:45:02",
    "image_url": "/saved_images/abc1232039023.png"
  }
}
```

### PUT `/api/racetracks/<id>`
Update racetrack image.

**Request:**
```json
{
  "image": "data:image/png;base64,..."
}
```

### POST `/api/racetracks/<id>/times`
Submit a race time for a specific track.

**Request:**
```json
{
  "username": "john_doe",
  "time": 45.23
}
```

**Response (New Record):**
```json
{
  "message": "Race time submitted successfully",
  "username": "john_doe",
  "time": 45.23,
  "is_new_record": true
}
```

**Response (Not Improved):**
```json
{
  "message": "Time not improved",
  "username": "john_doe",
  "time": 47.50,
  "current_best": 45.23,
  "is_new_record": false
}
```

### GET `/api/racetracks/<id>/leaderboard`
Get the leaderboard for a specific track, sorted by best times.

**Response:**
```json
{
  "racetrack_id": "abc1232039023",
  "racetrack_name": "Monaco Grand Prix",
  "leaderboard": [
    {
      "username": "speedster",
      "time": 42.15,
      "rank": 1
    },
    {
      "username": "john_doe",
      "time": 45.23,
      "rank": 2
    }
  ],
  "total_entries": 2
}
```

## Database

The API uses SQLite with Flask-SQLAlchemy for persistent storage. Database file: `racetracks.db`

**Racetrack Model:**
- `id` (String, Primary Key)
- `name` (String, 100 chars)
- `username` (String, 50 chars)
- `saved_file` (String, 200 chars)
- `leaderboard` (Text, JSON string storing username->time mapping)
- `uploaded_at` (DateTime)
- `updated_at` (DateTime, nullable)

Images are saved to the filesystem (`saved_images/`) and served via `/saved_images/<filename>` endpoint.

## Usage

1. Install dependencies: `pip install -r requirements.txt`
2. Run: `python app.py`
3. Server: `http://localhost:5000`
4. Test: `node test_racetrack_api.js`

## Testing

### Test welcome message
```bash
node test_racetrack_api.js welcome
```

### Upload a racetrack image
```bash
node test_racetrack_api.js upload racetrack.png "Silverstone Circuit" "john_doe"
```

### List all racetracks
```bash
node test_racetrack_api.js list
```

### List racetracks by user
```bash
node test_racetrack_api.js listuser john_doe
```

### Get specific racetrack (use ID from upload response)
```bash
node test_racetrack_api.js get abc123-def456-789...
```

### Update racetrack image
```bash
node test_racetrack_api.js update abc123-def456-789... new_racetrack.png
```

### Submit a race time
```bash
node test_racetrack_api.js submittime abc123-def456-789... john_doe 45.23
```

### View leaderboard for a track
```bash
node test_racetrack_api.js leaderboard abc123-def456-789...
```

## Available Test Commands
- `welcome` - Test GET /
- `upload <image_path> [name] [username]` - Test POST /api/racetracks
- `list` - Test GET /api/racetracks
- `listuser <username>` - Test GET /api/racetracks/user/<username>
- `get <racetrack_id>` - Test GET /api/racetracks/<id>
- `update <racetrack_id> <image_path>` - Test PUT /api/racetracks/<id>
- `submittime <racetrack_id> <username> <time>` - Test POST /api/racetracks/<id>/times
- `leaderboard <racetrack_id>` - Test GET /api/racetracks/<id>/leaderboard