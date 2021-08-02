const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const LOG_PREFIX = '[EVENT_BUS]';

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-srv:4000/events', event).catch((err) => {
    console.log(LOG_PREFIX, 'Can not post "POST service"');
  });
  axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log(LOG_PREFIX, 'Can not post "COMMENTS service"');
  });
  axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log(LOG_PREFIX, 'Can not post "QUERY service"');
  });

  axios.post("http://moderate-srv:4003/events", event).catch((err) => {
    console.log(LOG_PREFIX, 'Can not post "MODERATE service"');
  });
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Updated services addresses');
  console.log(LOG_PREFIX, 'Listening on 4005');
});
