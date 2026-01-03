const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Setup an in-memory hashMap to store registered webhooks
const registeredWebhooks = new Map();

app.post('/webhook/register', (req, res) => {
    // Take the callback url from the request body
    const {id, callbackUrl} = req.body || {};

    if (!id || !callbackUrl) {
        return res.status(400).send('Missing id or callbackUrl');
    };

    registeredWebhooks.set(id, callbackUrl);

    // Respond to acknowledge receipt of the event
    res.status(200).send('Event received');
});

async function notifyCallbackUrl(id, data) {
    try {
        const callbackUrl = registeredWebhooks.get(id);
        console.log("callback url", callbackUrl);
        const response = await fetch(callbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error(`Failed to notify ${id}: ${response.status}`);
        } else {
            console.log(`Successfully notified ${id}`);
        }
    }   catch (error) {
        console.error(`Error notifying ${id}: ${JSON.stringify(error)}`);
    }   
}

app.get('/', (req, res) => {
    res.send('Webhook server is running');
});

app.get('/events/:id/update', async (req, res) => {

    const {id} = req.params;

    const sampleData = { message: 'This is a sample event notification' };
    
    try{
        await notifyCallbackUrl(id, sampleData);
        return res.status(200).json({ message: "Webhook delivered" });
    }
    catch(err){
        return res.status(502).json({ error: "Failed to deliver webhook", details: String(err.message || err) });
    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
