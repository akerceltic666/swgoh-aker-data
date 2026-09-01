const fs = require("fs");
const path = require("path");

const INPUT = path.join(
    __dirname,
    "..",
    "output",
    "campaign.json"
);

const OUTPUT = path.join(
    __dirname,
    "..",
    "output",
    "campaign_app.json"
);


function generateAppCampaign() {

    console.log("");
    console.log("===============================");
    console.log(" GENERANDO CAMPAIGN APP");
    console.log("===============================");


    const json = JSON.parse(
        fs.readFileSync(INPUT, "utf8")
    );

    const campaigns =
        json.data || json;


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

                            rewardPreview:
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

                                }))

                        };


                        // Solo guardamos misiones
                        // que realmente tengan
                        // fragmentos de unidades

                        if (
                            missionResult.rewardPreview.length === 0
                        ) {

                            continue;

                        }


                        nodeResult.campaignNodeMission.push(
                            missionResult
                        );

                    }


                    if (
                        nodeResult.campaignNodeMission.length === 0
                    ) {

                        continue;

                    }


                    difficultyResult.campaignNode.push(
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
                    .push(difficultyResult);

            }


            if (
                mapResult.campaignNodeDifficultyGroup.length === 0
            ) {

                continue;

            }


            campaignResult.campaignMap.push(
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


    fs.writeFileSync(
        OUTPUT,
        JSON.stringify(result)
    );


    console.log("");

    console.log(
        "Campañas originales:",
        campaigns.length
    );

    console.log(
        "Campañas incluidas:",
        result.length
    );

    console.log(
        "Tamaño original:",
        (
            fs.statSync(INPUT).size /
            1024 /
            1024
        ).toFixed(2),
        "MB"
    );

    console.log(
        "Tamaño nuevo:",
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
