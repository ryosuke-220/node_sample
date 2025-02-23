'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
require("dotenv").config();

const setupRichMenu = require('../src/Common/RichMenu/SetupRichMenu'); 
const sendMessage = require('../src/Common/Send/SendMessage');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const app = express();
const port = process.env.PORT || 10000;

// 非同期でリッチメニューをセットアップ
(async () => {
    try {
        await setupRichMenu();
        console.log("リッチメニュー設定完了！");
    } catch (error) {
        console.error("リッチメニュー設定エラー:", error);
    }
})();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post("/webhook", line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(async (event) => {
        if (event.source && event.source.userId) {
            console.log("あなたのUser ID:", event.source.userId);
        }
    }))
    .then(() => res.status(200).end())
    .catch((err) => {
        console.error(err);
        res.status(500).end();
    });
});

const client = new line.Client(config);

async function handleEvent(event) {
    try {
        if (event.type !== 'message' || event.message.type !== 'text') {
            await client.replyMessage(event.replyToken, {
                type: 'text',
                text: '申し訳ありませんが、当該メッセージはサポートしていません。',
            });
        } else {
            await sendMessage.sendMessage(client, event);
        }
    } catch (error) {
        console.error("メッセージ処理中のエラー:", error);
    }
}

app.listen(port, '0.0.0.0', () => {
    console.log(`http://localhost:${port}/`);
});
