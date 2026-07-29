const path = require("path");

const download = require("./download");
const decompress = require("./decompress");

async function processFile(file) {

    const tempFile = path.join(
        __dirname,
        "..",
        "temp",
        file.name
    );

    const outputFile = path.join(
        __dirname,
        "..",
        "output",
        file.name.replace(".br", "")
    );

    console.log("----------------------------------");
    console.log("Procesando:", file.name);

    await download(file.url, tempFile);

    decompress(tempFile, outputFile);

    console.log("Finalizado:", file.name);
}

module.exports = processFile;