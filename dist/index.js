"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// すべての依存関係をインポートし、見やすくするために構造化
const bot_sdk_1 = require("@line/bot-sdk");
const express = require("express");
require('dotenv').config();
// LINEクライアントとExpressの設定を行う
const clientConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET,
};
const middlewareConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET || '',
};
const PORT = process.env.PORT || 80;
// LINE SDKクライアントを新規に作成
const client = new bot_sdk_1.Client(clientConfig);
// Expressアプリケーションを新規に作成
const app = express();
// テキストを受け取る関数
const textEventHandler = async (event) => {
    // すべての変数を処理
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }
    // メッセージに関連する変数をこちらで処理
    const { replyToken } = event;
    const { text } = event.message;
    // 新規メッセージの作成
    const response = {
        type: 'text',
        text: 'HELLO!',
    };
    // ユーザーに返信
    await client.replyMessage(replyToken, response);
};
// LINEミドルウェアを登録
// ルートハンドラの中でミドルウェアを渡すことも可能↓
// app.use(middleware(middlewareConfig));
// Webhookイベントを受信する
// 接続テストを受信
app.get('/', async (_, res) => {
    return res.status(200).json({
        status: '成功',
        message: '正常に接続されました!',
    });
});
// Webhookに使用されるルート
app.post('/webhook', (0, bot_sdk_1.middleware)(middlewareConfig), async (req, res) => {
    res.status(200).end(); //タイムアウトのエラー対策
    const events = req.body.events;
    // 受信したすべてのイベントを非同期で処理
    const results = await Promise.all(events.map(async (event) => {
        try {
            await textEventHandler(event);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err);
            }
            // エラーメッセージを返す
            return res.status(500).json({
                status: 'エラー',
            });
        }
    }));
    // 成功した場合のメッセージを返す
    return res.status(200).json({
        status: '成功',
        results,
    });
});
// サーバーを作成し80番ポートでlistenする
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
