const http = require('https');

const prodUrl = 'https://www.freelancebox.jp';

function getUrl(path) {
    return new Promise((resolve) => {
        const start = Date.now();
        http.get(`${prodUrl}${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const duration = Date.now() - start;
                resolve({
                    status: res.statusCode,
                    duration,
                    dataSize: data.length
                });
            });
        }).on('error', (err) => {
            resolve({
                status: 500,
                duration: Date.now() - start,
                error: err.message
            });
        });
    });
}

async function main() {
    console.log("=== Testing Homepage Load Speeds (After ISR Caching) ===");
    
    // First request (might fetch or validate)
    const res1 = await getUrl('/');
    console.log(`Request 1: Status ${res1.status}, Duration: ${res1.duration} ms`);

    // Second request (should hit Vercel Edge Cache immediately)
    const res2 = await getUrl('/');
    console.log(`Request 2: Status ${res2.status}, Duration: ${res2.duration} ms`);

    // Third request
    const res3 = await getUrl('/');
    console.log(`Request 3: Status ${res3.status}, Duration: ${res3.duration} ms`);
}

main();
