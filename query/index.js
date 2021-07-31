const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const LOG_PREFIX = '[QUERY]';

const posts = {};

app.get("/posts", (req, res) => {
    req.send(posts);
});

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;

        const post = posts[postId];

        if (post) {
          post.comments.push({ id, content });
        }
    }

    console.log(LOG_PREFIX, 'POSTS: ', posts);
    res.send({});
});

app.listen(4002, () => {
    console.log(LOG_PREFIX, "Listening on 4002");
});