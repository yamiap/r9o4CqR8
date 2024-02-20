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

const { unzip, readDir, filterImage } = require("./IOhandler");
const { question } = require("./question");

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");

const main = async () => {
    const filter = await question();
    let pathProcessed = path.join(__dirname, "unfiltered");

    if (filter == "grayscale") pathProcessed = "grayscaled";
    if (filter == "sepia") pathProcessed = "sepia_filtered";

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
            filterImage(pathIn, pathOut, filter);
        });
        // console.log("All files processed");
    } catch (err) {
        console.error(err);
    }
};

main();
