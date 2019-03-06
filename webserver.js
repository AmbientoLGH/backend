let express         = require("express"),
    app             = express(),
    configuration   = require("./config"),
    espConverter    = require("./espConverter"),
    utilities       = require("./utilities"),
    bodyParser      = require("body-parser"),
    http            = require("http").Server(app);

/**
 * Starting http-webServer listening on port set in configuration
 * @returns {Promise<Function>}
 */
function startWebServer() {
    return new Promise((resolve)=>http.listen(configuration.socket.port,resolve));
}

/**
 * Enabling bodyParser module as middleware item (request -> middleware -> endpoint)
 * Converting POST-Data values in JSON-Array
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Endpoint for mode updates with required value mode
 * Currently supported modes:
 *  Rainbow: ESP-Side Rainbow Effect
 *  ChainReaction: Random ESP-Side Effect
 *  Race: ESP-Side followup color effect displayed as race
 *  Ambieto: Enabling Ambiento-Mode (listening to input python-module values)
 *  On: Enabling ESP-Lights to last non-ambiento-mode
 *  Off: Disabling ESP-Lights
 */
app.post("/update/",(req,res)=>{
    if(typeof req.body.mode === "undefined") return res.json({result:"error",message:"Mode parameter missing"});

    console.log("Received update");

    let mode = req.body.mode;
    switch(mode) {
        case "color": {
            if(typeof req.body.color === "undefined" || !/^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(req.body.color))
                return res.json({result:"error",message:"Invalid color string"});
            let {r,g,b} = utilities.hexToRgb(req.body.color);

            let lights = typeof req.body.lights !== "undefined"?100:parseInt(req.body.lights);

            if(isNaN(lights)) lights = 100;
            if(lights>100) lights = 100;
            if(lights<0) lights = 0;

            espConverter.updateColor(r,g,b,lights);
        } break;
        case "chain-reaction":  espConverter.startChainReaction(); break;
        case "blink":           espConverter.startBlinking(); break;
        case "ambiento":        espConverter.toggleAmbiento(); break;
        case "on":              espConverter.enableLights(); break;
        case "off":             espConverter.disableLights(); break;
        case "dunkler":         espConverter.decreaseBrightness(); break;
        case "heller":          espConverter.increaseBrightness(); break;
        case "rainbow":         espConverter.toggleRainbow(); break;
    }

    res.json({result:"success",message:"Update submitted"});
});



module.exports = {
    http,
    app,
    startWebServer: startWebServer
};