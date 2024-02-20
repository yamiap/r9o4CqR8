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

const { grayScaleFilter, sepiaFilter } = require("./filters");

const PNG = require("pngjs").PNG;
const yauzl = require("yauzl-promise");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const unzip = async (pathIn, pathOut) => {
    // do I need this (outer) try-catch pair?
    try {
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
        } catch (err) {
            console.error(err);
        } finally {
            await zip.close();
        }
    } catch (err) {
        console.error(err);
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
    try {
        let files = await fs.readdir(dir);
        return files.filter((file) => path.extname(file) == ".png");
    } catch (err) {
        console.error(err);
    }
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

const filterImage = async (pathIn, pathOut, filter) => {
    let pathProcessed = path.join(__dirname, "unfiltered");

    if (filter == "grayscale") pathProcessed = "grayscaled";
    if (filter == "sepia") pathProcessed = "sepia_filtered";

    // do I need this try-catch pair?
    try {
        await fs.mkdir(pathProcessed, { recursive: true });
        await pipeline(
            createReadStream(pathIn),
            new PNG({ filterType: 4 }).on("parsed", function () {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var idx = (this.width * y + x) << 2;

                        if (filter == "grayscale") {
                            [
                                this.data[idx],
                                this.data[idx + 1],
                                this.data[idx + 2],
                            ] = grayScaleFilter(
                                this.data[idx],
                                this.data[idx + 1],
                                this.data[idx + 2]
                            );
                        } else if (filter == "sepia") {
                            [
                                this.data[idx],
                                this.data[idx + 1],
                                this.data[idx + 2],
                            ] = sepiaFilter(
                                this.data[idx],
                                this.data[idx + 1],
                                this.data[idx + 2]
                            );
                        }
                    }
                }
                pipeline(this.pack(), createWriteStream(pathOut));
            })
        );
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    unzip,
    readDir,
    filterImage,
};
