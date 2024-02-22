/*
 * Project: Milestone 1
 * File Name: filterer.js
 * Description: Collection of functions for image colour filtering
 *
 * Created Date: 2024-02-13
 * Author: Augustin Nguyen
 * Created for Armaan Dhanji's Winter 2024 semester ACIT 2520 course at BCIT
 *
 */

"use strict";

const imageFilter = (r, g, b, filter) => {
  if (filter == "grayscale") {
    return grayScaleFilter(r, g, b);
  } else if (filter == "sepia") {
    return sepiaFilter(r, g, b);
  } else if (filter == "blue filter") {
    return blueFilter(r, g, b);
  }
};

const grayScaleFilter = (r, g, b) => new Array(3).fill((r + g + b) / 3);

const sepiaFilter = (r, g, b) => {
  const newR = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
  const newG = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
  const newB = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
  return [newR, newG, newB];
};

const blueFilter = (r, g, b) => {
  if (b < 96) return [r, g, 0];
  else return [r, g, b * 0.7];
};

module.exports = { imageFilter };
