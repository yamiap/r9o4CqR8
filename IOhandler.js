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

const fs = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { imageFilter } = require("./filterer");
const PNG = require("pngjs").PNG;
const readline = require("readline-sync");
const yauzl = require("yauzl-promise");

/**
 * Description: prompt the user to select a filter
 *
 * @return {promise}
 */

const filterPrompt = async () => {
    console.log("Available filters: \ngrayscale\nsepia\n");
    let filter;
    while (
        filter != "grayscale" &&
        filter != "greyscale" &&
        filter != "sepia"
    ) {
        filter = readline.question(
            "Enter the filter you would like to apply: "
        );
    }
    if (filter == "greyscale") filter = "grayscale";
    console.log(`You chose the ${filter} filter`);
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
    // do I need this (outer) try-catch pair?
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
        // do I need this catch block?
        // } catch (err) {
        //     console.error(err);
    } finally {
        await zip.close();
        console.log("Extraction operation complete");
    }
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} dir
 * @return {promise}
 */

const readDir = async (dir) => {
    // do I need this try-catch pair?
    const files = await fs.readdir(dir);
    const pngFiles = files.filter((file) => path.extname(file) == ".png");
    console.log("Directory reading complete");
    return pngFiles;
};

/**
 * Description: Loop through array of png file paths,
 * call filterImage for each image
 *
 * @param {array} images
 * @param {string} pathProcessed
 * @param {string} filter
 * @return {promise}
 */

const processImages = async (images, pathUnzipped, pathProcessed, filter) => {
    images.forEach((image) => {
        let pathIn = path.join(pathUnzipped, image);
        let pathOut = path.join(pathProcessed, image);
        filterImage(pathIn, pathOut, filter);
    });
    // console.log("All files processed"));
};

/**
 * Description: Read in png file by given pathIn,
 * apply filter specified and write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @param {string} filter
 * @return {promise}
 */

const filterImage = async (pathIn, pathOut, filter) => {
    await pipeline(
        createReadStream(pathIn),
        new PNG({ filterType: 4 }).on("parsed", function () {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    [this.data[idx], this.data[idx + 1], this.data[idx + 2]] =
                        imageFilter(
                            this.data[idx],
                            this.data[idx + 1],
                            this.data[idx + 2],
                            filter
                        );
                }
            }
            pipeline(this.pack(), createWriteStream(pathOut));
        })
    );
};

module.exports = {
    filterPrompt,
    unzip,
    readDir,
    processImages,
};
