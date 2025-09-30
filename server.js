const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

const MUSIC_DIRECTORY = path.join(__dirname, '2016-01');
const LOG_FILE = path.join(__dirname, 'log.txt');

// Helper function to write logs
const writeLog = (logData) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${logData}\n`;
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
};

// API endpoint to get the list of songs
// Takes a 'caseType' parameter
app.get('/get-songs', (req, res) => {
    const caseType = req.query.caseType;

    writeLog(`User requested songs with case type: ${caseType}`);

    fs.readdir(MUSIC_DIRECTORY, (err, files) => {
        if (err) {
            writeLog(`Error reading directory: ${err.message}`);
            return res.status(500).json({ error: 'Failed to read music files.' });
        }

        const musicFilenames = files.filter(name => {
            const ext = path.extname(name).toLowerCase();
            return ['.mp3'].includes(ext); // Only accepts mp3 now
        });

        res.json({ files: musicFilenames, caseType: caseType });
    });
});

// API endpoint to get song metadata (title and artist)
const getMetadata = (filename) => {
    // This is a placeholder. In a real-world scenario, you would use a library
    // like 'music-metadata' to read the actual MP3 tags.
    const parts = filename.substring(0, filename.lastIndexOf('.')).split(' - ');
    if (parts.length > 1) {
        return {
            artist: parts[0].trim(),
            title: parts[1].trim()
        };
    }
    return {
        artist: 'Unknown Artist',
        title: filename
    };
};

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    writeLog('Server started.');
});