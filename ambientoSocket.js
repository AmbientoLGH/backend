let socketIO,
    configuration       = require("./config"),
    listener            = {},

    pythonModule        = undefined,
    espModules          = [],
    dashboardModules    = [];

function addListener(type,callback) {
    if(typeof listener[type] === "undefined") listener[type] = [];
    listener[type].push(callback);
}

function broadcastListenerData(type,data) {
    if(typeof listener[type] !== "undefined")
        listener[type].forEach((listener)=>listener(data));
}

function startClientListener() {
    socketIO.on("connection",(socket)=>{
        console.log("New connection. Waiting for device authentication...");

        socket.on("device",(data)=>{
            let type = data.type;
            console.log("Device authenticated as "+type);

            switch(type) {
                case "python": pythonModule = socket; initializePythonModule(); break;
                case "esp": espModules.push(socket); break;
                case "dashboard": dashboardModules.push(socket); break;
                case "android": break;
                default: console.log("Unknown device type...");
            }
        });
    });
}

function initializePythonModule() {
    pythonModule.on(configuration.socket.communicationChannel,(data)=>{
        broadcastListenerData("python-vs",data.value);
    });

    pythonModule.on("disconnect",()=>{
        console.log("Python Module disconnected...");
        pythonModule = undefined;
    });
}

function initializeSocket(http) {
    socketIO = require("socket.io")(http);
}

module.exports = {
    addListener,
    broadcastListenerData,
    startClientListener,
    initializeSocket,
    dashboardModules
};