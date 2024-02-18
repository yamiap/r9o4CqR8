/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: a Node.js application that extracts PNG images from a zip file and applies filters
 *
 * Created Date: 2024-02-13
 * Author: Augustin Nguyen
 * Created for Armaan Dhanji's Winter 2024 semester ACIT 2520 course at BCIT
 *
 */

"use strict";

const path = require("path");

const { unzip, readDir, grayScale } = require("./IOhandler");

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

const main = async () => {
    try {
        // do I need to assign these to variables?
        await unzip(zipFilePath, pathUnzipped);
        console.log("Extraction operation complete");
        const images = await readDir(pathUnzipped);
        console.log("Directory reading complete");
        // should this loop be in IOhandler?
        // do I need await here?
        await images.forEach((image) => {
            let pathIn = path.join(pathUnzipped, image);
            let pathOut = path.join(pathProcessed, image);
            grayScale(pathIn, pathOut);
        });
        // console.log("All files processed");
    } catch (err) {
        console.error(err);
    }
};

main();
