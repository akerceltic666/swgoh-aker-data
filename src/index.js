const fs = require("fs");
const path = require("path");

const config = require("../config");
const processFile = require("./process");
const generateAppUnits = require("./generateAppUnits");
const generateAppLoc = require("./generateAppLoc");
const generateAppMaterial = require("./generateAppMaterial");

const git = require("./git");
const downloadImages = require("./downloadImages");


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

    // Procesar archivos GameData
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

    // Generar archivos optimizados para la app
    console.log("");
    console.log("===============================");
    console.log(" GENERANDO DATOS PARA LA APP");
    console.log("===============================");

    try {

         console.log(" generateAppUnits");
        generateAppUnits();

    }
    catch (e) {

        console.log("");
        console.log("ERROR GENERANDO UNITS APP");
        console.log(e);

    }

    try {
        console.log(" generateAppLoc");
        generateAppLoc();

    }
    catch (e) {

        console.log("");
        console.log("ERROR GENERANDO loc APP");
        console.log(e);

    }

try {
        console.log(" generateAppMaterial");
        generateAppLoc();

    }
    catch (e) {

        console.log("");
        console.log("ERROR GENERANDO material APP");
        console.log(e);

    }

    


    // Descargar imágenes
    console.log("");
    console.log("===============================");
    console.log(" DESCARGANDO IMÁGENES");
    console.log("===============================");

    try {

        await downloadImages(config);

    }
    catch (e) {

        console.log("ERROR DESCARGANDO IMÁGENES");
        console.log(e);

    }

    console.log("");
    console.log("Subiendo cambios a GitHub...");

    git.push();

    console.log("");
    console.log("===============================");
    console.log(" PROCESO TERMINADO");
    console.log("===============================");

}

main();