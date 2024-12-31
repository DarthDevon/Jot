const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Fetch topic content from SharePoint
app.post("/fetch-topic", async (req, res) => {
    const { sharepointUrl, accessToken } = req.body; // URL and token passed from frontend

    try {
        const response = await axios.get(sharepointUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        res.json({ content: response.data });
    } catch (error) {
        console.error("Error fetching SharePoint content:", error.message);
        res.status(500).send("Failed to fetch content from SharePoint.");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
