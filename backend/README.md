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
    "saved_file": "saved_images/abc1232039023.svg",
    "uploaded_at": "2025-09-13T13:45:02"
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
      "saved_file": "saved_images/abc1232039023.svg",
      "uploaded_at": "2025-09-13T13:45:02"
    }
  ]
}
```

### GET `/api/racetracks/<id>`
Get specific racetrack with full image data.

### PUT `/api/racetracks/<id>`
Update racetrack image.

**Request:**
```json
{
  "image": "data:image/png;base64,..."
}
```

## Usage

1. Run: `python app.py`
2. Server: `http://localhost:5000`
3. Test: `node test_racetrack_api.js`

Images are automatically converted to SVG format.


## Testing
### Test welcome message
node test_racetrack_api.js welcome

### Upload a racetrack image
node test_racetrack_api.js upload racetrack.png "Silverstone Circuit"

### List all racetracks
node test_racetrack_api.js list

### Get specific racetrack (use ID from upload response)
node test_racetrack_api.js get abc123-def456-789...

### Update racetrack image
node test_racetrack_api.js update abc123-def456-789... new_racetrack.png