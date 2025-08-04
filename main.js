var { app, BrowserWindow, dialog, ipcMain, session } = require("electron");
var child_process = require("child_process");
var path = require("path");
var { performance } = require("perf_hooks");

var constele_version = "0.3b";
var latest_fps = 0;
var next_task_id = 0;
var title_update_interval;
var win;

var child_main_path = "./child_worker/main.js";
var child_workers = [];

//Initialise functions
{
  var createWindow = () => {
    //Declare local instance variables
    win = new BrowserWindow({
      width: 3840,
      height: 2160,
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: false,
        nodeIntegration: true,
        webSecurity: false
      },

      icon: path.join(__dirname, `gfx/logo.png`)
    });

    //Load file; open Inspect Element
    win.loadFile("index.html");
    win.webContents.openDevTools();
    win.setMenuBarVisibility(false);

    //Listen for FPS updates from the renderer process
    ipcMain.on("update-fps", (event, fps) => {
      latest_fps = fps;
    });

    //Update the title every second with the latest data
    title_update_interval = setInterval(function () {
      var memory_usage = process.memoryUsage();

      var heap_used_mb = (memory_usage.heapUsed/1024/1024).toFixed(2);
      var rss_mb = (memory_usage.rss/1024/1024).toFixed(2);
      var title_string = `Constele Red ${constele_version} - FPS: ${latest_fps} | RAM: RSS ${rss_mb}MB/Heap ${heap_used_mb}MB`;

      win.setTitle(title_string);
    }, 1000);

    //Get the default session
    try {
      var default_session = session.defaultSession;

      //Set up CORS settings for the default session
      default_session.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Access-Control-Allow-Origin': ['*'],
            'Access-Control-Allow-Methods': ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
            'Access-Control-Allow-Headers': ['Content-Type', 'Authorization']
          }
        });
      });
    } catch (e) {
      console.warn(e);
    }
  };

  function handleOpenFolder (arg0_event, arg1_starting_path) {
    //Convert from parameters
    var event = arg0_event;
    var starting_path = arg1_starting_path;

    //Declare local instance variables
    var actual_options = {
      title: "Open Folder",
      defaultPath: starting_path,
      properties: ["openDirectory"]
    };

    //Show the dialog and wait for the user's choice
    var result = dialog.showOpenDialogSync(actual_options);

    //Result is an array of paths, or undefined if the user cancelled
    if (result && result.length > 0)
      //Return statement
      return result[0]; //Return the first selected path
    return undefined;
  }
  
  function initialiseChildWorkers () {
    if (child_workers.length <= 0)
      startChildWorker();
  }
  
  function startChildWorker () {
    //Declare local instance variables
    var child_worker = child_process.fork(child_main_path);
    var pending_tasks = new Map();
    
    child_worker.on("message", ({ task_id, result, error }) => {
      var { resolve, reject } = pending_tasks.get(task_id) || {};
      
      if (resolve) {
        (error) ? reject(error) : resolve(result);
        pending_tasks.delete(task_id);
      }
    });
    child_worker.on("exit", () => {
      child_worker = null;
    });
    
    child_workers.push({ worker: child_worker, pending_tasks: pending_tasks });
  }
}

//App handling
{
  //Launch app when ready
  app.whenReady().then(() => {

    //Create the window and instantiate it
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length == 0) createWindow();
    });
    app.on("ready", () => {
      Menu.setApplicationMenu(null);
    });
  });

  //Window lifecycle defaults
  app.on("window-all-closed", () => {
    if (process.platform != "darwin") app.quit();
  });
}

//Bindings handler
{
  ipcMain.handle("dialog:openFolder", handleOpenFolder);
  ipcMain.handle("run-task", async (arg0_event, arg1_code, arg2_args, arg3_options) => {
    //Convert from parameters
    var event = arg0_event;
    var code = arg1_code;
    var args = arg2_args;
    var options = (arg3_options) ? arg3_options : {};
    
    //Initialise child workers just in case they haven't yet been called
    initialiseChildWorkers();
    
    //Declare local instance variables
    var target_child_worker = (options.child_worker_id) ? options.child_worker_id : 0;
    var task_id = next_task_id++;
    
    var child_worker = child_workers[target_child_worker];
    
    //Run eval
    return new Promise((resolve, reject) => {
      child_worker.pending_tasks.set(task_id, { resolve, reject });
      child_worker.worker.send({ task_id, code, args });
    });
  });
}