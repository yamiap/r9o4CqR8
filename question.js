const readline = require("readline-sync");

const question = async () => {
    console.log(
        "Available filters: \ngrayscale\nplaceholder\n"
    );
    let filter;
    while (filter != "grayscale" && filter != "placeholder") {
        filter = readline.question(
            "Enter the filter you would like to apply: "
        );
    }
    return filter;
};

module.exports = { question };
