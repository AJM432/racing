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

// Test upload racetrack with start position
async function testUploadWithStartPos(imagePath, startPos, name = 'Test Racetrack with Start Pos', username = 'testuser') {
    try {
        console.log(`Testing POST /api/racetracks with start_pos ${JSON.stringify(startPos)}`);
        
        const base64Image = imageToBase64(imagePath);
        if (!base64Image) return;

        const response = await fetch(`${API_BASE_URL}/api/racetracks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, image: base64Image, start_pos: startPos })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
            console.log('Racetrack ID:', result.racetrack.id);
            console.log('Start Position:', result.racetrack.start_pos);
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

// Test get racetracks by username
async function testListByUser(username) {
    try {
        console.log(`Testing GET /api/racetracks/user/${username}`);
        const response = await fetch(`${API_BASE_URL}/api/racetracks/user/${username}`);
        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
            console.log(`Found ${result.count} racetracks for user: ${result.username}`);
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
                uploaded_at: result.racetrack.uploaded_at
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

// Test update racetrack with start position
async function testUpdateWithStartPos(racetrackId, imagePath, startPos) {
    try {
        console.log(`Testing PUT /api/racetracks/${racetrackId} with start_pos ${JSON.stringify(startPos)}`);
        
        const base64Image = imageToBase64(imagePath);
        if (!base64Image) return;

        const response = await fetch(`${API_BASE_URL}/api/racetracks/${racetrackId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image, start_pos: startPos })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
            console.log('Updated Start Position:', result.racetrack.start_pos);
        } else {
            console.error('Failed:', result);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

// Test start position validation errors
async function testStartPosValidation(imagePath) {
    console.log('Testing start_pos validation with various invalid inputs...\n');
    
    const base64Image = imageToBase64(imagePath);
    if (!base64Image) return;

    const testCases = [
        { start_pos: [1], description: 'single value array' },
        { start_pos: [1, 2, 3], description: 'three value array' },
        { start_pos: ['a', 'b'], description: 'non-numeric values' },
        { start_pos: 'invalid', description: 'string instead of array' },
        { start_pos: {x: 1, y: 2}, description: 'object instead of array' }
    ];

    for (const testCase of testCases) {
        try {
            console.log(`Testing ${testCase.description}: ${JSON.stringify(testCase.start_pos)}`);
            
            const response = await fetch(`${API_BASE_URL}/api/racetracks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: 'Validation Test', 
                    username: 'testuser', 
                    image: base64Image, 
                    start_pos: testCase.start_pos 
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('❌ Unexpected success - validation should have failed');
            } else {
                console.log('✅ Correctly rejected:', result.error);
            }
            console.log('');
        } catch (error) {
            console.error('Network error:', error.message);
        }
    }
}

// Test submit race time
async function testSubmitTime(racetrackId, username, time) {
    try {
        console.log(`Testing POST /api/racetracks/${racetrackId}/times`);
        
        const response = await fetch(`${API_BASE_URL}/api/racetracks/${racetrackId}/times`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, time: parseFloat(time) })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
            if (result.is_new_record) {
                console.log('🏆 New record set!');
            } else {
                console.log('⏱️ Time submitted but not a new record');
            }
        } else {
            console.error('Failed:', result);
        }
    } catch (error) {
        console.error('Network error:', error.message);
    }
}

// Test get leaderboard
async function testLeaderboard(racetrackId) {
    try {
        console.log(`Testing GET /api/racetracks/${racetrackId}/leaderboard`);
        
        const response = await fetch(`${API_BASE_URL}/api/racetracks/${racetrackId}/leaderboard`);
        const result = await response.json();
        
        if (response.ok) {
            console.log('Success:', result);
            console.log(`\n🏁 Leaderboard for "${result.racetrack_name}":`);
            result.leaderboard.forEach(entry => {
                const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '  ';
                console.log(`${medal} ${entry.rank}. ${entry.username} - ${entry.time}s`);
            });
            console.log(`\nTotal entries: ${result.total_entries}`);
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
        console.log('  uploadwithstartpos <image_path> <start_pos> [name] [username] - Test POST /api/racetracks with start_pos');
        console.log('  list                              - Test GET /api/racetracks');
        console.log('  listuser <username>               - Test GET /api/racetracks/user/<username>');
        console.log('  get <racetrack_id>                - Test GET /api/racetracks/<id>');
        console.log('  update <racetrack_id> <image_path> - Test PUT /api/racetracks/<id>');
        console.log('  updatewithstartpos <racetrack_id> <image_path> <start_pos> - Test PUT /api/racetracks/<id> with start_pos');
        console.log('  submittime <racetrack_id> <username> <time> - Test POST /api/racetracks/<id>/times');
        console.log('  leaderboard <racetrack_id>        - Test GET /api/racetracks/<id>/leaderboard');
        console.log('  startposvalidation <image_path>   - Test start_pos validation');
        return;
    }
    
    switch (testName) {
        case 'welcome':
            testWelcome();
            break;
        case 'upload':
            const imagePath = args[1];
            const name = args[2] || 'Test Racetrack';
            const uploadUsername = args[3] || 'testuser';
            if (!imagePath) {
                console.error('Error: Image path required for upload test');
                return;
            }
            testUpload(imagePath, name, uploadUsername);
            break;
        case 'uploadwithstartpos':
            const uploadImagePath = args[1];
            const uploadStartPos = JSON.parse(args[2]);
            const uploadWithName = args[3] || 'Test Racetrack with Start Pos';
            const uploadWithUsername = args[4] || 'testuser';
            if (!uploadImagePath || !uploadStartPos) {
                console.error('Error: Image path and start_pos required for uploadwithstartpos test');
                return;
            }
            testUploadWithStartPos(uploadImagePath, uploadStartPos, uploadWithName, uploadWithUsername);
            break;
        case 'list':
            testList();
            break;
        case 'listuser':
            const listUsername = args[1];
            if (!listUsername) {
                console.error('Error: Username required for listuser test');
                return;
            }
            testListByUser(listUsername);
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
        case 'updatewithstartpos':
            const updateWithId = args[1];
            const updateWithImagePath = args[2];
            const updateWithStartPos = JSON.parse(args[3]);
            if (!updateWithId || !updateWithImagePath || !updateWithStartPos) {
                console.error('Error: Racetrack ID, image path, and start_pos required for updatewithstartpos test');
                return;
            }
            testUpdateWithStartPos(updateWithId, updateWithImagePath, updateWithStartPos);
            break;
        case 'submittime':
            const submitRacetrackId = args[1];
            const submitUsername = args[2];
            const submitTime = args[3];
            if (!submitRacetrackId || !submitUsername || !submitTime) {
                console.error('Error: Racetrack ID, username, and time required for submittime test');
                return;
            }
            testSubmitTime(submitRacetrackId, submitUsername, submitTime);
            break;
        case 'leaderboard':
            const leaderboardRacetrackId = args[1];
            if (!leaderboardRacetrackId) {
                console.error('Error: Racetrack ID required for leaderboard test');
                return;
            }
            testLeaderboard(leaderboardRacetrackId);
            break;
        case 'startposvalidation':
            const validationImagePath = args[1];
            if (!validationImagePath) {
                console.error('Error: Image path required for startposvalidation test');
                return;
            }
            testStartPosValidation(validationImagePath);
            break;
        default:
            console.error('Unknown test:', testName);
            console.log('Available tests: welcome, upload, uploadwithstartpos, list, listuser, get, update, updatewithstartpos, submittime, leaderboard, startposvalidation');
    }
}

// Run the main function
main();
