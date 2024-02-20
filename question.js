const readline = require("readline-sync");

const question = async () => {
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
    return filter;
};

module.exports = { question };
