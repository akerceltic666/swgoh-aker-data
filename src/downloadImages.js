const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(__dirname, "..", "output");

async function downloadImages(config) {

    for (const imageConfig of config.images) {

        console.log("");
        console.log("==================================");
        console.log("Imágenes:", imageConfig.file);

        const jsonPath = path.join(OUTPUT, imageConfig.file);

        if (!fs.existsSync(jsonPath)) {

            console.log("No existe:", jsonPath);
            continue;

        }

        const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

        const outputFolder = path.join(
            OUTPUT,
            "images",
            imageConfig.folder
        );

        fs.mkdirSync(outputFolder, { recursive: true });

        const data = json.data || json;

        let descargadas = 0;
        let existentes = 0;
        let errores = 0;

        for (const item of data) {

            const icon = item[imageConfig.iconField];

            if (!icon)
                continue;

            const fileName = icon + ".png";

            const filePath = path.join(
                outputFolder,
                fileName
            );

            if (fs.existsSync(filePath)) {

                existentes++;
                continue;

            }

            const url =
                "https://game-assets.swgoh.gg/textures/" +
                fileName;

            try {

                const response = await fetch(url);

                if (!response.ok) {

                    console.log("No encontrada:", fileName);
                    errores++;
                    continue;

                }

                const arrayBuffer =
                    await response.arrayBuffer();

                fs.writeFileSync(
                    filePath,
                    Buffer.from(arrayBuffer)
                );

                console.log("OK:", fileName);

                descargadas++;

            }
            catch (e) {

                console.log("Error:", fileName);
                errores++;

            }

        }

        console.log("");
        console.log("Nuevas:", descargadas);
        console.log("Existían:", existentes);
        console.log("Errores:", errores);

    }

}

module.exports = downloadImages;