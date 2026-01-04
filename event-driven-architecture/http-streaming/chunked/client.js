// Make a fetch call and consume these chunks
async function consumeStream() {
    const res = await fetch('http://localhost:3003/startStream');

    if(!res.ok){
        throw new Error(`https error: ${res.status}`);
    }

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

    while(true){
        const { value, done} = await reader.read();

        if(done) break;

        console.log("chunk: " + value);
    }

    console.log("stream ended");
};

consumeStream().catch(console.error);
