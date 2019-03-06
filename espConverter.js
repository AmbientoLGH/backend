let ambientoService     = require("./ambientoService"),
    Rainbow             = require("rainbowvis.js"),
    utilities           = require("./utilities"),
    currentConfiguation = {
        red         : 255,
        green       : 255,
        blue        : 255,
        lights      : 100,
        brightness  : 255,
        ambiento    : false
    },
    rainbowConfiguration = {
        enabled     : false,
        reverseOrder: false,
        instance    : null,
        limit       : 120,
        index       : 0
    };

function initializeRainbowInstance() {
    if(rainbowConfiguration.instance == null) {
        rainbowConfiguration.instance = new Rainbow();
        rainbowConfiguration.instance.setNumberRange(0,rainbowConfiguration.limit);
    }

    rainbowUpdater();
}

function rainbowUpdater() {
    if(rainbowConfiguration.enabled) {
        let index = rainbowConfiguration.index,
            order = rainbowConfiguration.reverseOrder,
            color = rainbowConfiguration.instance.colourAt(index);

        let rgb = utilities.hexToRgb(color);
        currentConfiguation.red = rgb.r;
        currentConfiguation.green = rgb.g;
        currentConfiguation.blue = rgb.b;

        if(!currentConfiguation.ambiento) updateColor();

        if (order) {
            index--;
            if (index < 0) {
                index = 0;
                order = !order;
            }
        } else {
            index++;
            if (index > rainbowConfiguration.limit) {
                index = rainbowConfiguration.limit;
                order = !order;
            }
        }

        rainbowConfiguration.index = index;
        rainbowConfiguration.reverseOrder = order;
    }

    setTimeout(rainbowUpdater, 25);
}

/**
 * Updating color on ESP (static light)
 * @param red {int} - 0 - 255
 * @param green {int} - 0 - 255
 * @param blue {int} - 0 - 255
 * @param lights {int=100} - 0 - 100
 */
function updateColor(red=currentConfiguation.red,green=currentConfiguation.green,blue=currentConfiguation.blue,lights=100) {

    currentConfiguation.red = red;
    currentConfiguation.green = green;
    currentConfiguation.blue = blue;
    currentConfiguation.lights = lights;

    submitCommand("color;"+currentConfiguation.brightness+";"+red+";"+green+";"+blue+";"+lights);
}

function toggleRainbow() {
    rainbowConfiguration.enabled = !rainbowConfiguration.enabled;
}

/**
 * Starting chain-reaction effect and stopping ambiento listener
 */
function startChainReaction() {
    currentConfiguation.ambiento = false;
    rainbowConfiguration.enabled = false;
    submitCommand("chain-reaction");
}


/**
 * Starting race effect and stopping ambiento listener
 */
function startBlinking() {
    currentConfiguation.ambiento = false;
    rainbowConfiguration.enabled = false;
    submitCommand("blink");
}


/**
 * Enabling esp lights and stopping ambiento listener
 */
function disableLights() {
    currentConfiguation.ambiento = false;
    rainbowConfiguration.enabled = false;
    submitCommand("off");
}

/**
 * Disabling esp effect and stopping ambiento listener
 */
function enableLights() {
    submitCommand("on");

    if(currentConfiguation.brightness===0) {
        currentConfiguation.brightness = 50;
        updateColor();
    }
}

function toggleAmbiento() {
    currentConfiguation.ambiento = !currentConfiguation.ambiento;
}

function startAmbientoListener() {
    ambientoService.addListener("python-vs",(value)=>{
        if(currentConfiguation.ambiento) {
            updateColor(currentConfiguation.red,currentConfiguation.green,currentConfiguation.blue,Math.round(value/10));
        }
    });
}

function submitCommand(command) {
    console.log("\x1b[35mCore\x1b[0m --> \x1b[36mESP\x1b[0m: \x1b[33m"+command+"\x1b[0m");
    ambientoService.espModules.forEach((esp)=>esp.emit("ambiento",command));
}

function decreaseBrightness() {
    currentConfiguation.brightness-=50;
    if(currentConfiguation.brightness<0) currentConfiguation.brightness = 0;
    updateColor();
}

function increaseBrightness() {
    currentConfiguation.brightness+=50;
    if(currentConfiguation.brightness>255) currentConfiguation.brightness = 255;
    updateColor();
}

initializeRainbowInstance();
startAmbientoListener();

module.exports = {
    updateColor,
    startChainReaction,
    startBlinking,
    toggleRainbow,
    disableLights,
    enableLights,
    toggleAmbiento,
    decreaseBrightness,
    increaseBrightness,
    ambientoRunning: currentConfiguation.ambiento,
    brightness: currentConfiguation.brightness
};