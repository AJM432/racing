// Test script for Racetrack API
// Run with: node test_racetrack_api.js

const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://localhost:5000';

// Helper function to convert image file to base64
function imageToBase64(imagePath) {
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

// Upload racetrack function
async function uploadRacetrack(name, imagePath) {
    try {
        console.log(`\n🏁 Uploading racetrack: ${name}`);
        
        const base64Image = imageToBase64(imagePath);
        if (!base64Image) {
            console.error('❌ Failed to convert image to base64');
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/api/racetracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                image: base64Image
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Upload successful!');
            console.log('📋 Response:', result);
            return result.racetrack;
        } else {
            console.error('❌ Upload failed:', result);
            return null;
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
        return null;
    }
}

// Get all racetracks
async function getAllRacetracks() {
    try {
        console.log('\n📋 Fetching all racetracks...');
        
        const response = await fetch(`${API_BASE_URL}/api/racetracks`);
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Fetch successful!');
            console.log(`📊 Found ${result.racetracks.length} racetracks:`);
            result.racetracks.forEach((track, index) => {
                console.log(`   ${index + 1}. ${track.name} (ID: ${track.id})`);
                console.log(`      Uploaded: ${track.uploaded_at}`);
            });
            return result.racetracks;
        } else {
            console.error('❌ Fetch failed:', result);
            return null;
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
        return null;
    }
}

// Get specific racetrack by ID
async function getRacetrack(id) {
    try {
        console.log(`\n🔍 Fetching racetrack with ID: ${id}`);
        
        const response = await fetch(`${API_BASE_URL}/api/racetracks/${id}`);
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Fetch successful!');
            console.log(`🏁 Racetrack: ${result.racetrack.name}`);
            console.log(`📅 Uploaded: ${result.racetrack.uploaded_at}`);
            console.log(`🖼️  Image size: ${result.racetrack.image.length} characters`);
            return result.racetrack;
        } else {
            console.error('❌ Fetch failed:', result);
            return null;
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
        return null;
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Racetrack API Tests');
    console.log('================================');
    
    // Test 1: Upload a racetrack (using the existing racetrack.png file)
    const imagePath = './racetrack.png';
    
    if (fs.existsSync(imagePath)) {
        const uploadedTrack = await uploadRacetrack('Monaco Grand Prix', imagePath);
        
        if (uploadedTrack) {
            // Test 2: Get all racetracks
            await getAllRacetracks();
            
            // Test 3: Get specific racetrack
            await getRacetrack(uploadedTrack.id);
        }
    } else {
        console.log('⚠️  racetrack.png not found. Creating a test upload with sample data...');
        
        // Create a minimal test image (1x1 pixel PNG in base64)
        const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        
        const response = await fetch(`${API_BASE_URL}/api/racetracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test Circuit',
                image: testImage
            })
        });
        
        const result = await response.json();
        console.log('📋 Test upload result:', result);
        
        if (response.ok) {
            await getAllRacetracks();
            await getRacetrack(result.racetrack.id);
        }
    }
    
    console.log('\n🏁 Tests completed!');
}

// Run the tests
runTests().catch(console.error);
