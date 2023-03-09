const fs = require('fs');
const https = require('https');

const apilink = 'https://nekos.life/api/v2/img/neko';

async function download() {
    let data = '';
    await https.get(apilink, (res) => {
        res.on('data', (d) => {
            data += d;
        })

        res.on('end', () => {
            const json = JSON.parse(data);
            const url = json.url;
            const filename = url.split('/').pop();

            https.get(url, (res) => {
                res.pipe(fs.createWriteStream("./nekos/" + filename));
                console.log('Downloaded ' + filename);
            });
        })
    })
}


if (!fs.existsSync('./nekos')) {
    fs.mkdirSync('./nekos');
    console.log('Created nekos folder');
}


setInterval(download, 5000);

console.log('Started downloading nekos every 5 seconds');
console.log('Press CTRL + C to stop');