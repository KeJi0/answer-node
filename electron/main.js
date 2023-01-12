const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
const {getConnection} = require('./connection');

let win ;
let tray;
let canQuit = false;
let connection;
 
function createWindow() {
    win  = new BrowserWindow({
        width:800,
        height:600,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname,'preload.js')
        }
    });
    const startURL = //isDev ? 'http://localhost:3000' :
     `file://${path.join(__dirname, '../build/index.html')}`;
    win.loadURL(startURL);
 
     // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
    win.on('close',e => {
        if(!canQuit) {
            e.preventDefault();
            win.hide()    
        }
    })    
}

function createTray() {
    // create Tray Icon
    const icon = nativeImage.createFromPath(path.join(__dirname,'../build/logo192.png'))
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([{
        label:'退出',
        click:() => {
            canQuit = true
            connection.end();
            app.quit();
            tray = null;
        }
    }])
    tray.setToolTip('自动提问小工具')
    tray.setContextMenu(contextMenu)
    tray.on('click',()=> {
        Menu.setApplicationMenu(null);
        win.show()
    }) 
}

async function createConnection() {
    connection =await getConnection();
    connection.connect();
}

app.whenReady().then(()=> {
    Menu.setApplicationMenu(null);
    createWindow();
    createTray();
    createConnection();
});

app.on('window-all-closed', (e) => {
    // if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
});

ipcMain.handle('findAll', async() => {
    var sql = 'SELECT * FROM question_answer';
    var [rows,fields] = await connection.query(sql);
    return rows;
    
})

ipcMain.handle('findByPriority', async (event, priority) => {
    var sql = 'SELECT * FROM question_answer where priority = ?';
    console.log(priority);
    var [rows,fields] = await connection.query(sql,priority);
    console.log(rows);
    return rows;
})

ipcMain.handle('findPriority', async () => {
    var sql = 'select distinct priority from question_answer';
    var [rows,fields] = await connection.query(sql);
    return rows.map(item => item.priority);
})

ipcMain.handle('updateAll', async(event,list) => {
    for(var i = 0; i< list.length; i++) {
        const sql = "UPDATE question_answer SET title = ?, content = ?, reference = ? WHERE id = ?;";
        const item = list[i];
        const sqlParams = [item.title,item.content,item.reference,item.id];
        await connection.query(sql,sqlParams);
    }
})

ipcMain.handle('save', async(event,item) => {
    console.log(item)
    var sql = 'INSERT INTO question_answer(title,content,reference,priority) VALUES (?,?,?,?)';
    var sqlParams  = Object.values(item);
    return await connection.query(sql,sqlParams);
})

ipcMain.handle('delete', async (event,id) => {
    var sql = "DELETE FROM question_answer WHERE id = ?";
    return await connection.query(sql,id); 
})

ipcMain.handle('update', async (event,item) => {
    const sql = "UPDATE question_answer SET priority = ?, times = ? WHERE id = ?;";
    const sqlParams = [item.priority,item.times,item.id];
    await connection.query(sql,sqlParams);
})

ipcMain.handle('win2show', ()=> {
    win.show();
})

