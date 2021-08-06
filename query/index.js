const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const LOG_PREFIX = '[QUERY]';

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];

        if (post) {
            post.comments.push({ id, content, status });
        }
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);

        comment.content = content;
        comment.status = status;
    }
}

app.get("/posts", (req, res) => {
    res.send(posts);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async() => {
    console.log(LOG_PREFIX, "Listening on 4002");

    const res =  await axios.get("http://event-bus-srv:4005/events").catch(() => {
        console.log('Something went Wrong during request');
    });

    res.data.forEach(event => handleEvent(event.type, event.data));
});