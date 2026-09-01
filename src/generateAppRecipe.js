const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(
    __dirname,
    "..",
    "output"
);

const OUTPUT_FILE = path.join(
    OUTPUT_DIR,
    "recipe_app.json"
);

const URL =
    "https://raw.githubusercontent.com/swgoh-utils/gamedata/main/recipe.json";


async function generateAppRecipe() {

    console.log("");
    console.log("===============================");
    console.log(" GENERANDO RECIPE APP");
    console.log("===============================");

    console.log("");
    console.log("Descargando recipe.json...");

    const response = await fetch(URL);

    if (!response.ok) {

        throw new Error(
            "No se pudo descargar recipe.json"
        );

    }

    const json = await response.json();

    const recipes =
        json.data || json;


    console.log(
        "Recetas originales:",
        recipes.length
    );


    // -----------------------------
    // Crear versión reducida
    // -----------------------------

    const result = {};


    for (const recipe of recipes) {

        if (!recipe.id) {
            continue;
        }


        result[recipe.id] = {

            result:
                recipe.result
                    ? {
                        id: recipe.result.id,
                        type: recipe.result.type,
                        minQuantity: recipe.result.minQuantity,
                        maxQuantity: recipe.result.maxQuantity,
                    }
                    : null,

            ingredients:
                (recipe.ingredients || [])
                    .map(ingredient => ({

                        id:
                            ingredient.id,

                        type:
                            ingredient.type,

                        minQuantity:
                            ingredient.minQuantity,

                        maxQuantity:
                            ingredient.maxQuantity,

                        rarity:
                            ingredient.rarity,

                    })),

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
        "Recetas incluidas:",
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


module.exports = generateAppRecipe;