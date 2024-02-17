/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 2024-02-13
 * Author: Augustin Nguyen
 *
 */

const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const PNG = require("pngjs").PNG;
const yauzl = require("yauzl-promise");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {};
// USE yauzl-promise HERE
const zip = await yauzl.open("/path/to/file.zip");
try {
    for await (const entry of zip) {
        if (entry.filename.endsWith("/")) {
            await fs.promises.mkdir(`/path/to/output/${entry.filename}`);
        } else {
            const readStream = await entry.openReadStream();
            const writeStream = fs.createWriteStream(
                `/path/to/output/${entry.filename}`
            );
            await pipeline(readStream, writeStream);
        }
    }
} finally {
    await zip.close();
}
/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {};

module.exports = {
    unzip,
    readDir,
    grayScale,
};
