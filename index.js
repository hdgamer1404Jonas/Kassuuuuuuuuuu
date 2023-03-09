const fs = require('fs');
const https = require('https');
const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 69,
    height: 69,
    icon: './electron/icon.jpg',
    frame: false,
  })

  win.loadFile('./electron/html/index.html')
}

app.on('ready', createWindow)

/*const apilink = 'https://nekos.life/api/v2/img/neko';

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
            
            const exists = fs.existsSync("./nekos/" + filename);
            if (exists) return console.log('File already exists, skipping...');

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
console.log('Press CTRL + C to stop');*/
