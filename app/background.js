import {
    app,
    BrowserWindow,
    Menu,
    dialog,
    ipcMain
}
from 'electron';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';
import env from './env';
import fs from 'fs';

var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 900
});
var images;
var defaults = {};

var ready = false;
const execFile = require('child_process').execFile;
function Layout_Designer(){
  execFile('D:/OneDrive - Landian Office 365/Graduate Implement/lightgallery-desktop/tmp/lightgallery/Lightgallery.exe', {
      cwd: 'D:/'
  }, function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error);
      }
  });
}
function Slide_Show(){
  execFile('D:/OneDrive - Landian Office 365/Graduate Implement/lightgallery-desktop/tmp/lightgallery/Lightgallery.exe', {
      cwd: 'D:/'
  }, function(error, stdout, stderr) {
      if (error !== null) {
          console.log('exec error: ' + error);
      }
  });
}


var setDevMenu = function() {
    var devMenu = Menu.buildFromTemplate([{
        label: 'Window',
        submenu: [{
            label: 'Toggle Full Screen',
            accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
            click(item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            }
        }, {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function() {
                app.quit();
            }
        }]
    }, {
        label: 'File',
        submenu: [{
            label: 'Add Images',
            click: function() {
                dialog.showOpenDialog({
                    properties: ['openFile', 'multiSelections'],
                    filters: [{
                        name: 'Images',
                        extensions: ['jpg', 'png', 'gif', 'webp']
                    }]
                }, function(files) {
                    mainWindow.webContents.send('openedFiles', files);
                });
            }
        }, {
            label: 'Add Folder',
            click: function() {
                dialog.showOpenDialog({
                    properties: ['openDirectory'],
                    filters: [{
                        name: 'Images',
                        extensions: ['jpg', 'png', 'gif', 'webp']
                    }]
                }, function(directory) {
                    mainWindow.webContents.send('openDirectory', directory);
                });
            }
        }]
    }, {
        label: 'Tool',
        submenu: [{
            label: 'Create Personal Album',
            click: function() {
                mainWindow.webContents.send('createPA');
            }
        }, {
            label: 'Slide Mode',
            click: function() {
                Slide_Show();
            }
        }, {
            label: 'Layout Designer',
            click: function() {
                Layout_Designer();
            }
        }]
    }, {
        label: 'Help',
        submenu: [{
            label: 'Developement',
            submenu: [{
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
                }
            }, {
                label: 'Toggle DevTools',
                accelerator: 'Alt+CmdOrCtrl+I',
                click: function() {
                    BrowserWindow.getFocusedWindow().toggleDevTools();
                }
            }]
        }]
    }]);
    Menu.setApplicationMenu(devMenu);
};

app.on('ready', function() {

    ready = true;
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    if (env.name === 'test') {
        mainWindow.loadURL('file://' + __dirname + '/spec.html');
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app.html');
    }

    fs.readFile(app.getPath('userData') + '/lg-config.json', function(err, data) {
        if (err) {
            fs.writeFile(app.getPath('userData') + '/lg-config.json', JSON.stringify(defaults), function(err) {
                if (err) throw err;
            });
        } else {
            defaults = JSON.parse(data);
        }

        setDevMenu();

        //mainWindow.openDevTools();
    });

    mainWindow.on('close', function() {
        mainWindowState.saveState(mainWindow);
    });

    mainWindow.webContents.on('dom-ready', function() {
        if (env.name !== 'production') {
            if (!images) {
                mainWindow.webContents.send('opened', app.getAppPath());
            };
        } else {
            if (images) {
                mainWindow.webContents.send('opened', images);
            };
        }
    });
});

app.on('window-all-closed', function() {
    app.quit();
});

app.on('activate', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('open-file', (event, path) => {
    event.preventDefault();

    //win.send('opened', path)
    if (ready) {
        win.webContents.send('opened', path);
        return;
    };

    images = path;
});
app.on('open-url', (event, path) => {
    event.preventDefault();

    //win.send('opened', path)
    if (ready) {
        win.webContents.send('opened', path);
        return;
    };

    images = arg;
});
ipcMain.on('createPA', (event) => {
    var presWindow = new BrowserWindow({
        width: 649,
        height: 602,
        show: false,
        frame: false
    })
    presWindow.loadURL('file://' + __dirname + '/create.html');
    presWindow.show();
});
app.on('createPA', (event) => {
    var presWindow = new BrowserWindow({
        width: 649,
        height: 602,
        show: false,
        frame: false
    })
    presWindow.loadURL('file://' + __dirname + '/create.html');
    presWindow.show();
});
