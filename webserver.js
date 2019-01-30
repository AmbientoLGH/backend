let express         = require("express"),
    app             = express(),
    configuration   = require("./config"),
    http            = require("http").Server(app);

function startWebserver() {
    return new Promise((resolve)=>http.listen(configuration.socket.port,resolve));
}

app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));

app.use(require("./routes/dashboard"));

app.get("/color/:color",function(req,res) {
    console.log("ITS ALIIIIIIIIIIIVEEEEEEEEEEEE "+req.params.color);
});

module.exports = {
    http,
    app,
    startWebserver
};