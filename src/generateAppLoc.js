const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(
    __dirname,
    "..",
    "output"
);

const LOC_INPUT = path.join(
    OUTPUT_DIR,
    "Loc_SPA_XM.txt.json"
);

const UNITS_INPUT = path.join(
    OUTPUT_DIR,
    "units_app.json"
);

const LOC_OUTPUT = path.join(
    OUTPUT_DIR,
    "loc_app.json"
);


function generateAppLoc() {

    console.log("");
    console.log("===============================");
    console.log(" GENERANDO LOC APP");
    console.log("===============================");

    // -----------------------------
    // Cargar loc original
    // -----------------------------

    console.log("Cargando loc original...");

    const locJson = JSON.parse(
        fs.readFileSync(LOC_INPUT, "utf8")
    );

    const loc = locJson.data || locJson;


    // -----------------------------
    // Cargar unidades
    // -----------------------------

    console.log("Cargando units_app...");

    const units = JSON.parse(
        fs.readFileSync(UNITS_INPUT, "utf8")
    );


    // -----------------------------
    // Recoger nameKey necesarios
    // -----------------------------

    const requiredKeys = new Set();

    for (const baseId of Object.keys(units)) {

        const unit = units[baseId];

        if (unit?.nameKey) {

            requiredKeys.add(unit.nameKey);

        }

    }


    // -----------------------------
    // Crear loc reducido
    // -----------------------------

    const result = {};

    let encontradas = 0;
    let noEncontradas = 0;

    for (const key of requiredKeys) {

        if (loc[key] !== undefined) {

            result[key] = loc[key];

            encontradas++;

        }
        else {

            noEncontradas++;

            console.log(
                "No encontrada:",
                key
            );

        }

    }


    // -----------------------------
    // Guardar
    // -----------------------------

    fs.writeFileSync(
        LOC_OUTPUT,
        JSON.stringify(result)
    );


    // -----------------------------
    // Estadísticas
    // -----------------------------

    console.log("");
    console.log("Claves de unidades:", requiredKeys.size);
    console.log("Traducciones encontradas:", encontradas);
    console.log("No encontradas:", noEncontradas);

    console.log("");
    console.log(
        "Tamaño original:",
        (
            fs.statSync(LOC_INPUT).size / 1024 / 1024
        ).toFixed(2),
        "MB"
    );

    console.log(
        "Tamaño nuevo:",
        (
            fs.statSync(LOC_OUTPUT).size / 1024
        ).toFixed(2),
        "KB"
    );

    console.log("");
    console.log("Generado:", LOC_OUTPUT);
    console.log("");

}

module.exports = generateAppLoc;