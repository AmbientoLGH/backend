let socketIO,
    configuration       = require("./config"),
    listener            = {},

    pythonModule        = undefined,
    espModules          = [],
    dashboardModules    = [];

/**
 * Adding listener for specific events by the type (identifier)
 * @param type {String}
 * @param callback {Function}
 */
function addListener(type,callback) {
    if(typeof listener[type] === "undefined") listener[type] = [];
    listener[type].push(callback);
}

/**
 * Broadcasting data to specific listener with type (identifier)
 * @param type {String}
 * @param data {*}
 */
function broadcastListenerData(type,data) {
    if(typeof listener[type] !== "undefined")
        listener[type].forEach((listener)=>listener(data));
}

/**
 * Starting socket io listener for incoming socket-connections with device-authentication
 * Supported devices in current version:
 *  Python (Microphone listener, 1 per session)
 *  ESP (LED Stripe, unlimited per session)
 */
function startClientListener() {
    socketIO.on("connection",(socket)=>{
        console.log("New connection. Waiting for device authentication...");

        socket.on("device",(data)=>{
            let type = data.type;
            console.log("Device authenticated as "+type);

            switch(type) {
                case "python": pythonModule = socket; initializePythonModule(); break;
                case "esp": espModules.push(socket); break;
                default: console.log("Unknown device type...");
            }
        });
    });
}

/**
 * Initializing python module with socket event listener for incoming value data
 */
function initializePythonModule() {
    pythonModule.on(configuration.socket.communicationChannel,(data)=>{
        broadcastListenerData("python-vs",data.value);
    });

    pythonModule.on("disconnect",()=>{
        console.log("Python Module disconnected...");
        pythonModule = undefined;
    });
}

/**
 * Initialization for socket module with webServer's http server
 * @param http
 */
function initializeSocket(http) {
    socketIO = require("socket.io")(http);
}

module.exports = {
    addListener,
    startClientListener,
    initializeSocket,
    dashboardModules,
    espModules
};