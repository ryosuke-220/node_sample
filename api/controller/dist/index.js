'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
require("dotenv").config();

//const setupRichMenu = require('./setupRichMenu'); 
const SendMessage = require('../src/Common/Send/SendMessage');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const app = express();
const port = process.env.PORT || 10000;

// サーバー起動時にリッチメニューをセットアップ
//setupRichMenu().then(() => console.log(" リッチメニュー設定完了！")).catch(console.error);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post("/webhook", line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

const client = new line.Client(config);

async function handleEvent(event) {
    const text = event.message.text;
    const replyToken = event.replyToken;
    
    if (event.type !== 'message' || event.message.type !== 'text') {
        // テキストメッセージ以外が送信された場合、「対応していない」旨を返す
        await client.replyMessage(replyToken, {
          type: 'text',
          text: '申し訳ありませんが、当該メッセージはサポートしていません。',
        });
    } else {
        await SendMessage.SendMessage(client, event);
    }
}

app.listen(port, '0.0.0.0', () => {
    console.log(`http://localhost:${port}/`);
});
