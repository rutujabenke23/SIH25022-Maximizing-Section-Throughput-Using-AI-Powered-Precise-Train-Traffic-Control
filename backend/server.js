const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// Allow frontend to communicate with backend
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Read train data
app.get("/api/trains", (req, res) => {
    const filePath = path.join(__dirname, "../data/train_data.csv");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to read train data"
            });
        }

        const lines = data.trim().split("\n");
        const headers = lines[0].split(",").map(header => header.trim());

        const trains = lines.slice(1).map(line => {
            const values = line.split(",").map(value => value.trim());

            const train = {};

            headers.forEach((header, index) => {
                train[header] = values[index];
            });

            return train;
        });

        res.json(trains);
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});