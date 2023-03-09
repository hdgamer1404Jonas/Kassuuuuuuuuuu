const { Titlebar, TitlebarColor } = require("custom-electron-titlebar")
const path = require("path")

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation
  new Titlebar({
    backgroundColor: TitlebarColor.fromHex("#470070"),
    itemBackgroundColor: TitlebarColor.fromHex("#881b00"),
    svgColor: TitlebarColor.WHITE,
    
    icon: path.join(__dirname, '../assets/logo.ico'),
    iconSize: 32,
  });
});