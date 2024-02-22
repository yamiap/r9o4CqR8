/*
 * Project: Milestone 1
 * File Name: worker.js
 * Description: Collection of functions for worker thread-related operations
 *
 * Created Date: 2024-02-13
 * Author: Augustin Nguyen
 * Created for Armaan Dhanji's Winter 2024 semester ACIT 2520 course at BCIT
 *
 */

"use strict";

const { createReadStream, createWriteStream } = require("fs"),
  path = require("path"),
  { pipeline } = require("stream/promises"),
  { parentPort } = require("worker_threads"),
  PNG = require("pngjs").PNG,
  { imageFilter } = require("./filterer");

/**
 * Description: Read in png file by given pathIn,
 * apply filter specified and write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @param {string} filter
 * @return {promise}
 */

const filterImage = (pathIn, pathOut, filter) => {
  pipeline(
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

parentPort.on("message", async (filterParameters) => {
  const filterPromises = filterParameters[0].map(async (image) => {
    let pathIn = path.join(filterParameters[1], image);
    let pathOut = path.join(filterParameters[2], image);
    await filterImage(pathIn, pathOut, filterParameters[3]);
  });

  await Promise.all(filterPromises);
});
