const fs = require("fs");
const path = require("path");

const OUTPUT = path.join(
    __dirname,
    "..",
    "output",
    "campaign_app.json"
);

const URL =
    "https://raw.githubusercontent.com/swgoh-utils/gamedata/main/campaign.json";


async function generateAppCampaign() {

    console.log("");
    console.log("===============================");
    console.log(" GENERANDO CAMPAIGN APP");
    console.log("===============================");


    // -----------------------------
    // Descargar campaign original
    // -----------------------------

    console.log("");
    console.log("Descargando campaign.json...");

    const response =
        await fetch(URL);

    if (!response.ok) {

        throw new Error(
            "No se pudo descargar campaign.json"
        );

    }

    const json =
        await response.json();

    const campaigns =
        json.data || json;


    // -----------------------------
    // Reducir datos
    // -----------------------------

    const result = [];


    for (const campaign of campaigns) {

        if (!campaign.id) {
            continue;
        }


        const campaignResult = {

            id:
                campaign.id,

            campaignMap: []

        };


        for (
            const map
            of campaign.campaignMap ?? []
        ) {

            const mapResult = {

                campaignNodeDifficultyGroup: []

            };


            for (
                const difficulty
                of map.campaignNodeDifficultyGroup ?? []
            ) {

                const difficultyResult = {

                    campaignNode: []

                };


                for (
                    const node
                    of difficulty.campaignNode ?? []
                ) {

                    if (!node.id) {
                        continue;
                    }


                    const nodeResult = {

                        id:
                            node.id,

                        campaignNodeMission: []

                    };


                    for (
                        const mission
                        of node.campaignNodeMission ?? []
                    ) {

                        if (!mission.id) {
                            continue;
                        }


                        const rewardPreview =
                            (
                                mission.rewardPreview ?? []
                            )

                            .filter(reward =>
                                reward.id?.startsWith(
                                    "unitshard_"
                                )
                            )

                            .map(reward => ({

                                id:
                                    reward.id

                            }));


                        // Solo necesitamos
                        // misiones que den
                        // fragmentos de unidades

                        if (
                            rewardPreview.length === 0
                        ) {

                            continue;

                        }


                        const missionResult = {

                            id:
                                mission.id,

                            descKey:
                                mission.descKey ?? "",

                            entryCostRequirement:
                                (
                                    mission.entryCostRequirement ?? []
                                ).map(cost => ({

                                    id:
                                        cost.id,

                                    minQuantity:
                                        cost.minQuantity ?? 0

                                })),

                            rewardPreview

                        };


                        nodeResult
                            .campaignNodeMission
                            .push(
                                missionResult
                            );

                    }


                    if (
                        nodeResult.campaignNodeMission.length === 0
                    ) {

                        continue;

                    }


                    difficultyResult
                        .campaignNode
                        .push(
                            nodeResult
                        );

                }


                if (
                    difficultyResult.campaignNode.length === 0
                ) {

                    continue;

                }


                mapResult
                    .campaignNodeDifficultyGroup
                    .push(
                        difficultyResult
                    );

            }


            if (
                mapResult
                    .campaignNodeDifficultyGroup
                    .length === 0
            ) {

                continue;

            }


            campaignResult
                .campaignMap
                .push(
                    mapResult
                );

        }


        if (
            campaignResult.campaignMap.length === 0
        ) {

            continue;

        }


        result.push(
            campaignResult
        );

    }


    // -----------------------------
    // Guardar
    // -----------------------------

    fs.writeFileSync(
        OUTPUT,
        JSON.stringify(result)
    );


    // -----------------------------
    // Estadísticas
    // -----------------------------

    console.log("");

    console.log(
        "Campañas originales:",
        campaigns.length
    );

    console.log(
        "Campañas incluidas:",
        result.length
    );

    console.log("");

    console.log(
        "Tamaño generado:",
        (
            fs.statSync(OUTPUT).size /
            1024
        ).toFixed(2),
        "KB"
    );

    console.log("");

    console.log(
        "Generado:",
        OUTPUT
    );

    console.log("");

}


generateAppCampaign();

module.exports = generateAppCampaign;
