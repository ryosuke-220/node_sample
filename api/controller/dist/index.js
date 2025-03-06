'use strict';

const line = require("@line/bot-sdk");
const express = require('express');
const setupRichMenu = require('../src/Common/RichMenu/SetupRichMenu'); 
const sendMessage = require('../src/Common/Send/SendMessage');
const { generateFlexMessage, getResponseText } = require('../src/Common/Template/generateFlexMessage');

const { config, client } = require('../src/config');

const app = express();
const port = process.env.PORT || 10000;

// 非同期でリッチメニューをセットアップ
(async () => {
    try {
        await setupRichMenu();
        console.log("リッチメニュー設定完了");
    } catch (error) {
        console.error("リッチメニュー設定エラー:", error);
    }
})();

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

async function handleEvent(event) {
    try {
        if (event.type === 'postback') {
            const data = event.postback.data;
            if (data === 'action=chatbot') {
                // リッチメニューの「チャットボット」ボタンが押された場合、フレックスメッセージを生成
                try {
                  const flexMessage = await generateFlexMessage();
                  await client.replyMessage(replyToken, flexMessage);
                } catch (error) {
                  console.error('エラーが発生しました: ', error);
                }
            }
        } else if (event.type !== 'message' || event.message.type !== 'text') {
            await client.replyMessage(event.replyToken, {
                type: 'text',
                text: '申し訳ありませんが、当該メッセージはサポートしていません。',
            });
        } else  {
            await sendMessage.sendMessage(client, event);
        }
    } catch (error) {
        console.error("メッセージ処理中のエラー:", error);
    }
}

app.listen(port, '0.0.0.0', () => {
    console.log(`http://localhost:${port}/`);
});
