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

const os = require("os");
const path = require("path");
const { filterPrompt, unzip, readDir, processImages } = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");

const main = async () => {
    try {
        const filter = await filterPrompt();
        await unzip(zipFilePath, pathUnzipped);
        const images = await readDir(pathUnzipped);
        await processImages(images, pathUnzipped, filter, os.cpus().length / 2);
    } catch (err) {
        console.error(err);
    }
};

main();
