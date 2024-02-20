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

const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { filterPrompt, unzip, readDir, processImages, run } = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
let pathProcessed;

const main = async () => {
    try {
        const filter = await filterPrompt();

        if (filter == "grayscale") {
            pathProcessed = path.join(__dirname, "grayscaled");
        } else if (filter == "sepia") {
            pathProcessed = path.join(__dirname, "sepia_filtered");
        }

        await fs.mkdir(pathProcessed, { recursive: true });
        await unzip(zipFilePath, pathUnzipped);
        const images = await readDir(pathUnzipped);
        await run(images, pathUnzipped, pathProcessed, filter,
            os.cpus().length / 2
        );
        // await processImages(images, pathUnzipped, pathProcessed, filter);
    } catch (err) {
        console.error(err);
    }
};

main();
