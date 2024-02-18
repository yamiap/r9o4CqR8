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
const { extname } = require("path");
const { pipeline } = require("stream/promises");

const { greyScaleFilter } = require("./filters.js");

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
    try {
        const zip = await yauzl.open(pathIn);
        try {
            for await (const entry of zip) {
                if (!entry.filename.includes("/")) {
                    const readStream = await entry.openReadStream();
                    const writeStream = createWriteStream(
                        path.join(pathOut, entry.filename)
                    );
                    await pipeline(readStream, writeStream);
                }
            }
        } catch (err) {
            console.log(err.code);
        } finally {
            await zip.close();
        }
    } catch (err) {
        console.log(err.code);
    }
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

const readDir = async (path) => {
    try {
        let files = await fs.readdir(path);
        return files.filter(file => extname(file) == ".png");
    } catch (err) {
        console.error(err.message);
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

const grayScale = (pathIn, pathOut) => {
    pipeline(
        createReadStream(pathIn),
        new PNG({ filterType: 4 }).on("parsed", function () {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    [this.data[idx], this.data[idx + 1], this.data[idx + 2]] =
                        greyScaleFilter(
                            this.data[idx],
                            this.data[idx + 1],
                            this.data[idx + 2]
                        );
                }
            }
            pipeline(this.pack(), createWriteStream(pathOut));
        })
    );
};

module.exports = {
    unzip,
    readDir,
    grayScale,
};
