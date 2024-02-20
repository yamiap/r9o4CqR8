/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 2024-02-13
 * Author: Augustin Nguyen
 * Created for Armaan Dhanji's Winter 2024 semester ACIT 2520 course at BCIT
 *
 */

"use strict";

const fs = require("fs/promises"),
    { createWriteStream } = require("fs"),
    path = require("path"),
    { pipeline } = require("stream/promises"),
    { Worker } = require("worker_threads"),
    readline = require("readline-sync"),
    yauzl = require("yauzl-promise");

/**
 * Description: prompt the user to select a filter
 *
 * @return {promise}
 */

const filterPrompt = async () => {
    console.log("\nAvailable filters: \ngrayscale\nsepia\nblue filter\n");
    let filter;
    while (
        filter != "grayscale" &&
        filter != "greyscale" &&
        filter != "sepia" &&
        filter != "blue filter"
    ) {
        filter = readline.question(
            "Enter the filter you would like to apply: "
        );
    }
    if (filter == "greyscale") filter = "grayscale";
    console.log(`\nYou chose the ${filter} filter`);
    return filter;
};

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const unzip = async (pathIn, pathOut) => {
    await fs.mkdir(pathOut, { recursive: true });
    const zip = await yauzl.open(pathIn);
    try {
        for await (const entry of zip) {
            if (
                !entry.filename.includes("/") &&
                !entry.filename.includes("\\")
            ) {
                const readStream = await entry.openReadStream();
                const writeStream = createWriteStream(
                    path.join(pathOut, entry.filename)
                );
                await pipeline(readStream, writeStream);
            }
        }
    } finally {
        await zip.close();
        console.log("Extraction operation complete");
    }
};

/**
 * Description: read all the png files from given directory,
 * return Promise containing array of each png file path
 *
 * @param {string} dir
 * @return {promise}
 */

const readDir = async (dir) => {
    const files = await fs.readdir(dir);
    const pngFiles = files.filter(
        (file) => path.extname(file).toLowerCase() == ".png"
    );
    console.log("Directory reading complete");
    return pngFiles;
};

/**
 * Description: read all the png files from given directory,
 * return Promise containing array of each png file path
 *
 * @param {array} array
 * @return {Number}
 */

const chunkify = async (array, concurrentWorkers) => {
    let chunks = [];
    for (let i = concurrentWorkers; i > 0; i--) {
        chunks.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return chunks;
};

/**
 * Description: Call chunkify and pass data to workers for processing
 *
 * @param {array} images
 * @param {string} pathUnzipped
 * @param {string} filter
 * @param {Number} concurrentWorkers
 * @return {promise}
 */

const processImages = async (
    images,
    pathUnzipped,
    filter,
    concurrentWorkers
) => {
    let pathProcessed;

    if (images.length < concurrentWorkers) {
        concurrentWorkers = images.length;
    }

    if (filter == "grayscale") {
        pathProcessed = path.join(__dirname, "grayscaled");
    } else if (filter == "sepia") {
        pathProcessed = path.join(__dirname, "sepiafied");
    } else if (filter == "blue filter") {
        pathProcessed = path.join(__dirname, "blue_filtered");
    }

    await fs.mkdir(pathProcessed, { recursive: true });
    const chunks = await chunkify(images, concurrentWorkers);

    chunks.forEach((data, i) => {
        let filterParameters = [data, pathUnzipped, pathProcessed, filter];
        const worker = new Worker("./worker.js");
        worker.postMessage(filterParameters);
        worker.on("message", () => {
            worker.terminate();
        });
    });
};

module.exports = {
    filterPrompt,
    unzip,
    readDir,
    processImages,
};
