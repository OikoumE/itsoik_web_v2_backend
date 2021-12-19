// File: app.js - entrypoint and API for itsoik.com
// Author: itsOiK
// Date: 16/12-21

// const app = require("express")();
// app.use(cors());
// const cors = require("cors");
// const cors = require("cors");
// const httpServer = require("http").Server(app);
// const httpServer = require("http").Server(app);
// var path = require("path");
// const io = require("socket.io")(httpServer);

import cors from "cors";
import express from "express";
import path from "path";
import http from "http";

const app = express();
app.use(cors());
const httpServer = http.Server(app);

import * as templateEngine from "./components/templateEngine/templateEngine.mjs";

const httpPort = 3001;
const ip = "192.168.50.48";
const RETURN404 = `<style> html { background-color: #000000;} </style><img src='https://http.cat/404.jpg' />`;

//! ------------------------------------ AUTOSHOUTOUT ------------------------------------ //
// //* ------- INDEX --------//
app.get("/", async (req, res) => {
    const html = await templateEngine.render("test.html");
    if (html) {
        res.set("Content-Type", "text/html").status(200).end(html);
    } else res.status(404).end(RETURN404);
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
app.get("/templateEngine.js", (req, res) => {
    res.sendFile(
        path.resolve(
            path.join("..", "frontend", "static", "script", "templateEngine.js")
        )
    );
});
app.get("/template/", (req, res) => {
    console.log(req.query);
    res.sendFile(
        path.resolve(
            path.join(
                "..",
                "frontend",
                "templates",
                `${req.query.template_name}.html`
            )
        )
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
//     sio.emit("shoutOut", userName);
//     res.status(200).json({ status: "Success!!!!" });
// });

//* OK!
//! ------------------------------------ LISTEN ------------------------------------ //

httpServer.listen(httpPort, ip, () => {
    const time = new Date();
    console.log(
        `${time.toLocaleTimeString()} - HTTP - server running at ${ip}:${httpPort}/`
    );
});
