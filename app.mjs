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

// function parseQuery(request) {
//     const query = request.query,
//         path = request.originalUrl;
//     console.log("[app:31]: query", query);
//     const parsedQuery = {};
//     for (const [key, value] of Object.entries(query)) {
//         try {
//             parsedQuery[key] = value;
//         } catch (err) {
//             // console.log("[app:37]: err", err);
//             console.log(`[app:35]: ERROR: ${err.name} - at: ${path}`);
//             if (err.name === "SyntaxError") {
//                 console.log(
//                     "[app:40]: ERROR: No arguments in GET-REQUEST at: ",
//                     path
//                 );
//             }
//         }
//     }
//     console.log("[app:47]: parsedQuery", parsedQuery);
//     return parsedQuery;
// }

//! ------------------------------------ AUTOSHOUTOUT ------------------------------------ //
// //* ------- INDEX --------//
app.get("/", async (req, res) => {
    // TEST URL: http://192.168.50.48:3001/?user=lalala&users=user1&users=user2&users=user3
    const html = await templateEngine.render("test.html", req.query);
    if (html) {
        res.set("Content-Type", "text/html").status(200).end(html);
    } else res.status(404).end(RETURN404);
});

app.get("/hello/", async (req, res) => {
    const html = await templateEngine.render("test.html");
    if (html) {
        res.set("Content-Type", "text/html").status(200).end(html);
    } else res.status(404).end(RETURN404);
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
