const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(
    __dirname,
    "..",
    "output"
);

const TEMP_FILE = path.join(
    OUTPUT_DIR,
    "material.json"
);

const OUTPUT_FILE = path.join(
    OUTPUT_DIR,
    "material_app.json"
);

const URL =
    "https://raw.githubusercontent.com/swgoh-utils/gamedata/main/material.json";


async function generateAppMaterial() {

    console.log("");
    console.log("===============================");
    console.log(" GENERANDO MATERIAL APP");
    console.log("===============================");

    console.log("");
    console.log("Descargando material.json...");

    const response = await fetch(URL);

    if (!response.ok) {

        throw new Error(
            "No se pudo descargar material.json"
        );

    }

    const json = await response.json();

    const materials =
        json.data || json;


    console.log(
        "Materiales originales:",
        materials.length
    );


    // -----------------------------
    // Crear versión reducida
    // -----------------------------

    const result = {};


    for (const material of materials) {

        // Solo materiales usados por la app
        if (
           // material.type !== 11 &&
            material.type !== 12
        ) {
            continue;
        }

        if (!material.id) {
            continue;
        }


        result[material.id] = {

            nameKey:
                material.nameKey,

            iconKey:
                material.iconKey,

            tier:
                material.tier,

            type:
                material.type,

        };

    }


    // -----------------------------
    // Guardar
    // -----------------------------

    fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(result)
    );


    console.log("");
    console.log(
        "Materiales incluidos:",
        Object.keys(result).length
    );

    console.log(
        "Tamaño nuevo:",
        (
            fs.statSync(OUTPUT_FILE).size / 1024
        ).toFixed(2),
        "KB"
    );

    console.log("");
    console.log(
        "Generado:",
        OUTPUT_FILE
    );

    console.log("");

}


module.exports = generateAppMaterial;
