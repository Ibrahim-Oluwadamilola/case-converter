const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
// This should be the exact name of the folder containing your music files.
const musicDirectory = path.join(__dirname, '2016-01');

// Serve static files from the current directory (like index.html)
app.use(express.static(__dirname));

// API endpoint to get the list of songs
app.get('/get-songs', (req, res) => {
    // Read the contents of the '2016-01' folder
    fs.readdir(musicDirectory, (err, files) => {
        if (err) {
            console.error('Error reading music directory:', err);
            // Send an error response to the client
            return res.status(500).json({ error: 'Failed to read music files.' });
        }

        // Filter for common music file extensions
        const musicFilenames = files.filter(name => {
            const ext = path.extname(name).toLowerCase();
            return ['.mp3', '.wav', '.flac', '.m4a', '.ogg'].includes(ext);
        });

        // Send the list of filtered filenames as a JSON response
        res.json({ files: musicFilenames });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});