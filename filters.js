/*
 * Project: Milestone 1
 * File Name: filters.js
 * Description: Collection of functions for image colour filtering
 *
 * Created Date: 2024-02-13
 * Author: Augustin Nguyen
 * Created for Armaan Dhanji's Winter 2024 semester ACIT 2520 course at BCIT
 *
 */

"use strict";

const grayScaleFilter = (r, g, b) => new Array(3).fill((r + g + b) / 3);

const sepiaFilter = (r, g, b) => {
    let newR = (0.393 * r + 0.769 * g + 0.189 * b) / 1.4;
    let newB = (0.272 * r + 0.534 * g + 0.131 * b) / 1.4;
    let newG = (0.349 * r + 0.686 * g + 0.168 * b) / 1.4;
    return [newR, newG, newB];
};

module.exports = { grayScaleFilter, sepiaFilter };
