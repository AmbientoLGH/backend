let configuration   = require("./config"),
    webServer       = require("./webserver"),
    ambientoSocket  = require("./ambientoSocket");

console.log("Starting Ambiento-NodeJS-Module v"+configuration.version);

ambientoSocket.initializeSocket(webServer.http);

webServer.startWebserver()
    .then(()=>ambientoSocket.startClientListener());

ambientoSocket.addListener("python-vs",(value)=>ambientoSocket.dashboardModules.forEach((socket)=>socket.emit(configuration.socket.communicationChannel,{value:value})));