const fs = require("fs");
const zlib = require("zlib");

function decompress(inputFile, outputFile) {

    console.log("Descomprimiendo:", inputFile);

    const compressed = fs.readFileSync(inputFile);

    const decompressed = zlib.brotliDecompressSync(compressed);

    fs.writeFileSync(outputFile, decompressed);

    console.log("OK:", outputFile);

}

module.exports = decompress;