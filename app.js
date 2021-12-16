// File: app.js - entrypoint and API for itsoik.com
// Author: itsOiK
// Date: 16/12-21

const fs = require("fs");
const app = require("express")();
const cors = require("cors");

app.use(cors());

const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);

const httpPort = 3001;
const ip = "192.168.50.48";
var path = require("path");

//! ------------------------------------ AUTOSHOUTOUT ------------------------------------ //
// //* ------- INDEX --------//
app.get("/", (req, res) => {
    res.sendFile(path.resolve(path.join("..", "frontend", "index.html")));
});
app.get("/base.css", (req, res) => {
    res.sendFile(
        path.resolve(path.join("..", "frontend", "static", "style", "base.css"))
    );
});
app.get("/nav.js", (req, res) => {
    res.sendFile(
        path.resolve(path.join("..", "frontend", "static", "script", "nav.js"))
    );
});

//* ------- SCRIPTS --------//
// app.get("/auto_shoutout/script.js", (req, res) => {
//     res.sendFile(__dirname + "/static/scripts/AutoShoutout.js");
// });
// //* ------- COMMANDS --------//
// app.post("/auto_shoutout/so", (params, res) => {
//     console.log(params.query);
//     let userName = params.query["user_name"];
//     io.emit("shoutOut", userName);
//     res.status(200).json({ status: "Success!!!!" });
// });

//* OK!
//! ------------------------------------ LISTEN ------------------------------------ //

httpServer.listen(httpPort, ip, () => {
    time = new Date();
    console.log(
        `${time.toLocaleTimeString()} - HTTP - server running at ${ip}:${httpPort}/`
    );
});
