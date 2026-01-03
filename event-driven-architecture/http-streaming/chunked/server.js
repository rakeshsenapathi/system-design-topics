const express = require('express');
const bodyParser = require('body-parser');
const { clearInterval } = require('timers');

const app = express();
app.use(bodyParser.json());

const PORT = 3003;

// this endpoint sends the response back in chunks
app.post('/startStream', (req, res) => {
    // const {id} = req.query?.id;

    const id = 1234;

    if(!id){
        console.log("Invalid id");
        res.status(400).send("Invalid id");
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');


    // flush headers early, if supported
    res.flushHeaders?.();

    let count = 0;

    res.write(`stream start id=${id}`);

    const interval = setInterval(() => {
        count += 1;

        res.write(`chunk: ${count} @${new Date().toISOString()} \n`);

        if(count >= 10){
            clearInterval(interval);
            res.write('stream-end\n');
            res.end();
        }
    }, 1000);

    req.on('close', () => {
        console.log('client disconnected');
    })

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
