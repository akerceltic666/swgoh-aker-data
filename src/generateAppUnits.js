const fs = require("fs");
const path = require("path");

const INPUT = path.join(
    __dirname,
    "..",
    "output",
    "units.txt.json"
);

const OUTPUT = path.join(
    __dirname,
    "..",
    "output",
    "units_app.json"
);

function generateAppUnits() {

    console.log("");
    console.log("===============================");
    console.log(" GENERANDO UNITS APP");
    console.log("===============================");

    const json = JSON.parse(
        fs.readFileSync(INPUT, "utf8")
    );

    const units = json.data;

    const result = {};

    for (const unit of units) {

        if (!unit.baseId) {
            continue;
        }

        // --------------------------------
        // Equipamiento por Gear
        // --------------------------------

        const gear = {};

        for (const tier of unit.unitTier || []) {

            // Solo Gear 1-12
            if (
                tier.tier < 1 ||
                tier.tier > 12
            ) {
                continue;
            }

            gear[tier.tier] =
                tier.equipmentSet || [];

        }

        // --------------------------------
        // Datos de la unidad
        // --------------------------------

        result[unit.baseId] = {

            nameKey:
                unit.nameKey,

            thumbnailName:
                unit.thumbnailName,

            grantStartTime:
                unit.grantStartTime,

            gear

        };

    }

    fs.writeFileSync(
        OUTPUT,
        JSON.stringify(result)
    );

    console.log("");
    console.log(
        "Unidades originales:",
        units.length
    );

    console.log(
        "Unidades reducidas:",
        Object.keys(result).length
    );

    console.log(
        "Generado:",
        OUTPUT
    );

    console.log("");

}


module.exports = generateAppUnits;
