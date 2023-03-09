const fs = require('fs');
const https = require('https');
const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const {Tray, Menu, dialog} = require('electron')
const {download} = require("electron-dl");

const { setupTitlebar, attachTitlebarToWindow } = require ("custom-electron-titlebar/main")

// setup the titlebar main process
setupTitlebar();

let tray;

app.whenReady().then(async () => {
    tray = new Tray(path.join(__dirname, '/electron/assets/logo.png'))

    const trayMenuTemplate = [
        {
            label: 'Kassuuuuuuuuuu',
            icon: path.join(__dirname,'/electron/assets/logo_small.png'),
            enabled: false
        }, 
        {
            label: 'Close App',
            click: function () {
                process.exit()
            }
        },
        {
            label: 'Open Gallery',
            click: function () {
                createGalleryWindow()
            }
        }
    ]

    let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
    tray.setContextMenu(trayMenu)
    tray.setToolTip("Kassuuuuuuuuuu")
})

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    titleBarStyle: 'hidden',
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: false,
        sandbox: false,
        preload: path.join(__dirname, '/electron/titlebar/preload.js')
    },
    icon: __dirname + '/electron/assets/logo.ico',
    autoHideMenuBar: true,
    transparent: false,
    frame: false,
    skipTaskbar: false,
    show: true
  })

  attachTitlebarToWindow(win);

  win.loadFile(__dirname + '/electron/html/startup.html')
}

const createGalleryWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false
        },
        icon: __dirname + '/electron/assets/logo.ico',
        autoHideMenuBar: true,
        show: true,
        resizable: false
    })
  
    win.loadFile('./electron/html/gallery.html')
}

app.on('ready', () => {
    createWindow()

    ipcMain.on('download', (event, info) => {
        const window = BrowserWindow.fromWebContents(event.sender)
        download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
            .then(dl =>{ 
                window.webContents.send("download complete", dl.getSavePath())
                const shell = require('electron').shell
                shell.showItemInFolder(dl.getSavePath())
            })
    })
})

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
