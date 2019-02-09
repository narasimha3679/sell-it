const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu} = electron;
const sqlite3 = require('sqlite3').verbose();
const ipc = electron.ipcMain;
let db = new sqlite3.Database('./database/database.sqlite3');
require('electron-reload')(__dirname);

let mainWindow;

function createWindow() {

    //creating new window
    mainWindow = new BrowserWindow({});
    //load html into window
    mainWindow.loadFile('./app/mainWindow.html');

    /*ipc start*/
    ipc.on('search-query', function (event, arg) {
        db.serialize(function () {

            db.all("SELECT productName, productCode, productPrice, productDiscount FROM products WHERE productName LIKE '%"+arg+"%' LIMIT 5", function (err, row) {
                console.log(row);
                event.sender.send("search-results",row);
            })


        })

    });
    /*ipc end*/

    /*
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    */

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

