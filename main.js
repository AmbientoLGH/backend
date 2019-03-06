let configuration   = require("./config"),
    webServer       = require("./webserver"),
    ambientoService  = require("./ambientoService"),
    espConverter    = require("./espConverter");

console.log("Starting Ambiento-NodeJS-Module v"+configuration.version);

ambientoService.initializeSocket(webServer.http);

webServer.startWebServer()
    .then(()=>ambientoService.startClientListener());