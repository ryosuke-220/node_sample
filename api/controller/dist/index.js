'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
require("dotenv").config();

const SendMessage = require('../src/Common/Send/SendMessage.js');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const app = express();

const port = process.env.PORT || 10000;

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
  if (event.type !== 'message' || event.message.type !== 'text') {
    // テキストメッセージ以外が送信された場合、「対応していない」旨を返す
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: '申し訳ありませんが、テキストメッセージ以外はサポートしていません。',
    });
    return Promise.resolve(null);  // 処理を終了
  } else if (event.message.text === 'チャットボット') {
    // ユーザーが「チャットボット」と送信した場合、フレックスメッセージを生成
    try {
      const flexMessage = await generateFlexMessage();
      await client.replyMessage(event.replyToken, flexMessage);
    } catch (error) {
      console.error('エラーが発生しました: ', error);
    }
  } else {
    // ユーザーがボタンを押した場合、そのテキストに対応するレスポンステキストを取得
    try {
      const responseText = await getResponseText(event.message.text);
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: responseText,
      });
    } catch (error) {
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: '該当する情報がありません。',
      });
    }
  }
}

app.listen(port, '0.0.0.0', () => {
    console.log(`http://localhost:${port}/`);
});
