// Test script for Racetrack API
// Run with: node test_racetrack_api.js <test_name> [image_path]
// Examples:
//   node test_racetrack_api.js welcome
//   node test_racetrack_api.js upload racetrack.png
//   node test_racetrack_api.js list
//   node test_racetrack_api.js get <racetrack_id>
//   node test_racetrack_api.js update <racetrack_id> racetrack.png

const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// Helper function to convert image file to base64
function imageToBase64(imagePath) {
    if (!fs.existsSync(imagePath)) {
        console.error(`Image file not found: ${imagePath}`);
        return null;
    }
    
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        const mimeType = getMimeType(imagePath);
        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error('Error reading image file:', error.message);
        return null;
    }
}

// Get MIME type based on file extension
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/png';
}

// Test welcome endpoint
async function testWelcome() {
    try {
        console.log('Testing GET /');
        const response = await fetch(`${API_BASE_URL}/`);
        const result = await response.text();
        
        if (response.ok) {
            console.log('Success:', result);
        } else {
            console.error('Failed:', response.status, result);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

// Test upload racetrack
async function testUpload(imagePath, name = 'Test Racetrack', username = 'testuser') {
    try {
        console.log(`Testing POST /api/racetracks with ${imagePath}`);
        
        const base64Image = imageToBase64(imagePath);
        if (!base64Image) return;

        const response = await fetch(`${API_BASE_URL}/api/racetracks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, image: base64Image })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
            console.log('Racetrack ID:', result.racetrack.id);
        } else {
            console.error('Failed:', result);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

// Test get all racetracks
async function testList() {
    try {
        console.log('Testing GET /api/racetracks');
        const response = await fetch(`${API_BASE_URL}/api/racetracks`);
        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
            console.log(`Found ${result.racetracks.length} racetracks`);
        } else {
            console.error('Failed:', result);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

// Test get specific racetrack
async function testGet(racetrackId) {
    try {
        console.log(`Testing GET /api/racetracks/${racetrackId}`);
        const response = await fetch(`${API_BASE_URL}/api/racetracks/${racetrackId}`);
        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', {
                id: result.racetrack.id,
                name: result.racetrack.name,
                username: result.racetrack.username,
                saved_file: result.racetrack.saved_file,
                uploaded_at: result.racetrack.uploaded_at,
                image_size: result.racetrack.image.length + ' characters'
            });
        } else {
            console.error('Failed:', result);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

// Test update racetrack
async function testUpdate(racetrackId, imagePath) {
    try {
        console.log(`Testing PUT /api/racetracks/${racetrackId} with ${imagePath}`);
        
        const base64Image = imageToBase64(imagePath);
        if (!base64Image) return;

        const response = await fetch(`${API_BASE_URL}/api/racetracks/${racetrackId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
        } else {
            console.error('Failed:', result);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

// Main function to handle command line arguments
function main() {
    const args = process.argv.slice(2);
    const testName = args[0];
    
    if (!testName) {
        console.log('Usage: node test_racetrack_api.js <test_name> [args...]');
        console.log('Tests:');
        console.log('  welcome                           - Test GET /');
        console.log('  upload <image_path> [name] [username] - Test POST /api/racetracks');
        console.log('  list                              - Test GET /api/racetracks');
        console.log('  get <racetrack_id>                - Test GET /api/racetracks/<id>');
        console.log('  update <racetrack_id> <image_path> - Test PUT /api/racetracks/<id>');
        return;
    }
    
    switch (testName) {
        case 'welcome':
            testWelcome();
            break;
        case 'upload':
            const imagePath = args[1];
            const name = args[2] || 'Test Racetrack';
            const username = args[3] || 'testuser';
            if (!imagePath) {
                console.error('Error: Image path required for upload test');
                return;
            }
            testUpload(imagePath, name, username);
            break;
        case 'list':
            testList();
            break;
        case 'get':
            const racetrackId = args[1];
            if (!racetrackId) {
                console.error('Error: Racetrack ID required for get test');
                return;
            }
            testGet(racetrackId);
            break;
        case 'update':
            const updateId = args[1];
            const updateImagePath = args[2];
            if (!updateId || !updateImagePath) {
                console.error('Error: Racetrack ID and image path required for update test');
                return;
            }
            testUpdate(updateId, updateImagePath);
            break;
        default:
            console.error('Unknown test:', testName);
            console.log('Available tests: welcome, upload, list, get, update');
    }
}

// Run the main function
main();
