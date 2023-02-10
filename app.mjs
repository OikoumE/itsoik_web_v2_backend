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

import { TemplateEngine } from "./components/templateEngine/templateEngine.mjs";
// import * as templateEngine from "./components/templateEngine/templateEngine.mjs";

const httpPort = 3001;
const ip = "192.168.50.48";
const RETURN_CODE = (code) => {
    return `<style> html { background-color: #000000;} </style><img src='https://http.cat/${code}.jpg' />`;
};
const templateEngine = new TemplateEngine();
//! ------------------------------------ AUTOSHOUTOUT ------------------------------------ //
// //* ------- INDEX --------//
app.get("/", async (req, res) => {
    // TEST URL: http://192.168.50.48:3001/?user=<p>lalalla<p>
    const data = {
        users: new Array(10).fill(123),
        user: "vivax",
    };
    const html = await templateEngine.render("home.html", data);
    if (html) {
        res.set("Content-Type", "text/html").status(200).end(html);
    } else res.status(404).end(RETURN_CODE(404));
});

app.get("/hello/", async (req, res) => {
    const data = {
        users: new Array(10).fill("hello"),
        user: "world",
    };

    const html = await templateEngine.render("test.html", data);
    if (html) {
        res.set("Content-Type", "text/html").status(200).end(html);
    } else res.status(404).end(RETURN_CODE(404));
});

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
