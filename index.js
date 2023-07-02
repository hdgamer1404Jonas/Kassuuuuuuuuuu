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
let rapid = false;
let rapidPath = "";
let intervalID;

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
        },
        {
            label: 'Toggle Rapid Download (off)',
            click: function () {
                rapidToggle()
            }
        },
        {
            label: 'Toggle Neko Images on Screen',
            click: function () {
                toggleNeko()
            }
        },
        {
            label: 'Turn on Neko Spam (Will crash your PC)',
            click: function () {
                setInterval(nekoSpam, 1000)
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
            enableRemoteModule: false,
            preload: path.join(__dirname, '/electron/titlebar/preload.js')
        },
        icon: __dirname + '/electron/assets/logo.ico',
        autoHideMenuBar: true,
        show: true,
        resizable: false,
        frame: false,
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


async function rapidToggle() {
    if (rapid == false) {
        rapid = true;
        console.log("Rapid Download: On")
        
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
            },
            {
                label: 'Toggle Rapid Download (on)',
                click: function () {
                    rapidToggle()
                }
            },
            {
                label: 'Toggle Neko Images on Screen',
                click: function () {
                    toggleNeko()
                }
            },
            {
                label: 'Turn on Neko Spam (Will crash your PC)',
                click: function () {
                    setInterval(nekoSpam, 1000)
                }
            }
        ]
    
        let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
        tray.setContextMenu(trayMenu)

        rapidPath = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        })

        // set interval to download neko every second

        intervalID = setInterval(() => {
            downloadNeko()
        }, 100);


    } else {
        rapid = false;
        console.log("Rapid Download: Off")
        
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
            },
            {
                label: 'Toggle Rapid Download (off)',
                click: function () {
                    rapidToggle()
                }
            },
            {
                label: 'Toggle Neko Images on Screen',
                click: function () {
                    toggleNeko()
                }
            },
            {
                label: 'Turn on Neko Spam (Will crash your PC)',
                click: function () {
                    setInterval(nekoSpam, 100)
                }
            }
        ]
    
        let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
        tray.setContextMenu(trayMenu)

        clearInterval(intervalID);
    }
}

const apilink = 'https://nekos.life/api/v2/img/neko';

async function downloadNeko() {
    let data = '';
    await https.get(apilink, (res) => {
        res.on('data', (d) => {
            data += d;
        })

        res.on('end', () => {
            const json = JSON.parse(data);
            const url = json.url;
            const filename = url.split('/').pop();
            
            const exists = fs.existsSync(rapidPath + "/" + filename);
            if (exists) return console.log('File already exists, skipping...');

            https.get(url, (res) => {
                res.pipe(fs.createWriteStream(rapidPath + "/" + filename));
                console.log('Downloaded ' + filename);
            });
        })
    })
}

let nekoTimer = 0;
let activeWindow;
let nekoActive = false;

setInterval(nekoLoop, 1000)

async function toggleNeko() {
    if (nekoActive) {
        nekoActive = false;
        console.log("Neko Images: Off")
        activeWindow.close();
    } else {
        nekoActive = true;
        console.log("Neko Images: On")
    }
}

async function nekoLoop(){
    if (nekoActive == false) return;
    
    console.log(nekoTimer)
    if (nekoTimer == 0) {
        // create window
        activeWindow = new BrowserWindow({
            width: 150,
            height: 150,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: false,
            },
            skipTaskbar: true,
            show: true,
            frame: false,
            resizable: false,
            alwaysOnTop: true,
        })

        activeWindow.loadFile(__dirname + '/electron/html/neko.html')
        activeWindow.setPosition(Math.floor(Math.random() * 1900), Math.floor(Math.random() * 1000))
    }

    if(nekoTimer == 60) {
        // close window
        activeWindow.close();
        nekoTimer = 0;
    }
    
    nekoTimer++;
}

async function nekoSpam() {
    const win = new BrowserWindow({
        width: 150,
        height: 150,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false,
        },
        skipTaskbar: true,
        show: true,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
    })

    win.loadFile(__dirname + '/electron/html/neko.html')
    win.setPosition(Math.floor(Math.random() * 1900), Math.floor(Math.random() * 1000))
}



