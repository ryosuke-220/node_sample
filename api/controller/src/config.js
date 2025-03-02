require("dotenv").config();
const line = require("@line/bot-sdk");

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

module.exports = { config, client };
