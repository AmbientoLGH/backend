let configuration   = require("./config"),
    ambientoSocket  = require("./ambientoSocket");

console.log("Starting Ambiento-NodeJS-Module v"+configuration.version);

ambientoSocket.startSocket()
    .then(()=>ambientoSocket.startClientListener());

ambientoSocket.addListener("python-vs",(value)=>console.log(value));