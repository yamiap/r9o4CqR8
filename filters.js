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

module.exports = { grayScaleFilter };
