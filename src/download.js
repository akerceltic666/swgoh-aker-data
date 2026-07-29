const fs = require("fs");
const axios = require("axios");

async function download(url, output) {

    const response = await axios({

        url,
        method: "GET",
        responseType: "stream"

    });

    const writer = fs.createWriteStream(output);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {

        writer.on("finish", resolve);

        writer.on("error", reject);

    });

}

module.exports = download;