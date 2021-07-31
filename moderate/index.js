const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const LOG_PREFIX = '[MODERATE]';
const BANNED_WORD = 'orange';


app.post("/events", async(req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const commentStatus = data.content.includes(BANNED_WORD) ? 'rejected' : 'approved';

        await axios.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: {
                // Do not use spread operator intentionally to see comment structure
                id: data.id,
                postId: data.postId,
                content: data.content,
                status: commentStatus
            },
        });
    }
});

app.listen(4003, () => {
    console.log(LOG_PREFIX, "Listening on 4003");
});