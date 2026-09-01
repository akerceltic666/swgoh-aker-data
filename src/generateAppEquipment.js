const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(
    __dirname,
    "..",
    "output"
);

const TEMP_FILE = path.join(
    OUTPUT_DIR,
    "equipment.json"
);

const OUTPUT_FILE = path.join(
    OUTPUT_DIR,
    "equipment_app.json"
);

const URL =
    "https://raw.githubusercontent.com/swgoh-utils/gamedata/main/equipment.json";


async function generateAppEquipment() {

    console.log("");
    console.log("===============================");
    console.log(" GENERANDO EQUIPMENT APP");
    console.log("===============================");

    console.log("");
    console.log("Descargando equipment.json...");

    const response = await fetch(URL);

    if (!response.ok) {

        throw new Error(
            "No se pudo descargar equipment.json"
        );

    }

    const json = await response.json();

    const equipment =
        json.data || json;


    console.log(
        "Equipos originales:",
        equipment.length
    );


    // -----------------------------
    // Crear versión reducida
    // -----------------------------

    const result = {};


    for (const item of equipment) {

        if (!item.id) {
            continue;
        }


        result[item.id] = {

            nameKey:
                item.nameKey,

            iconKey:
                item.iconKey,

            tier:
                item.tier,

            recipeId:
                item.recipeId,

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
        "Equipos incluidos:",
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


module.exports = generateAppEquipment;
