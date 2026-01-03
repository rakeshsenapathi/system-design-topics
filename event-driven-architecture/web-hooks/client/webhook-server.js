const bodyParser = require('body-parser');
const express = require('express');
// const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.post('/webhook', (req, res) => {
    console.log('Callback url called');
    res.send('Received update as a webhook');
});

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});