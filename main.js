const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//listen when app is ready
app.on('ready', function () {
    //creating new window
   mainWindow = new BrowserWindow({});
   //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
    {
        label: 'Help',
        submenu : [
            {
               label: 'About'
            },
            {
                label: 'quit',
                click(){
                    app.quit();
                }
            }
        ]
    }
]