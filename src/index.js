const fs = require("fs");
const path = require("path");

const config = require("../config");
const processFile = require("./process");

async function main() {

    console.log("");
    console.log("===============================");
    console.log(" SWGOH AKER DATA GENERATOR");
    console.log("===============================");
    console.log("");

    const temp = path.join(__dirname, "..", "temp");
    const output = path.join(__dirname, "..", "output");

    if (!fs.existsSync(temp)) {
        fs.mkdirSync(temp);
    }

    if (!fs.existsSync(output)) {
        fs.mkdirSync(output);
    }

    for (const file of config.files) {

        try {

            await processFile(file);

        }
        catch (e) {

            console.log("");
            console.log("ERROR PROCESANDO:", file.name);
            console.log(e);

        }

    }

    console.log("");
    console.log("===============================");
    console.log(" PROCESO TERMINADO");
    console.log("===============================");

}

main();