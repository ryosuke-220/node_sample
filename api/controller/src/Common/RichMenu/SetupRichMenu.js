require('dotenv').config();
const fs = require("fs");
const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
const userId = process.env.USER_ID;
const imagePath = process.env.IMAGE_PATH;

const client = new line.Client(config);

const richMenuData = {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "Main Menu",
    chatBarText: "メニューを開く",
    areas: [
        // 上段
        {
            bounds: { x: 0, y: 0, width: 833, height: 843 },
            action: { type: "url", url: "https://rispace.conohawing.com/home.php" }
        },
        {
            bounds: { x: 833, y: 0, width: 833, height: 843 },
            action: { type: "postback", data: "action=contact" }
        },
        {
            bounds: { x: 1666, y: 0, width: 834, height: 843 },
            action: { type: "url", url: "https://u.lin.ee/vyKGU9j" }
        },
        // 下段
        {
            bounds: { x: 0, y: 843, width: 833, height: 843 },
            action: { type: "postback", data: "action=reserve" }
        },
        {
            bounds: { x: 833, y: 843, width: 833, height: 843 },
            action: { type: "postback", data: "action=chatbot" }
        },
        {
            bounds: { x: 1666, y: 843, width: 834, height: 843 },
            action: { type: "url", url: "https://lin.ee/CuevDnt" }
        }
    ]
};

// リッチメニュー作成関数
async function createRichMenu() {
    try {
        const richMenuId = await client.createRichMenu(richMenuData);
        console.log("リッチメニュー作成成功！ID:", richMenuId);
        return richMenuId;
    } catch (error) {
        console.error("リッチメニュー作成エラー:", error.message);
        return null;
    }
}

// 画像アップロード
async function uploadRichMenuImage() {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        await client.setRichMenuImage(richMenuId, imageBuffer, "image/png");
        console.log("画像アップロード成功！");
    } catch (error) {
        console.error("画像アップロードエラー:", error.message);
    }
}

// ユーザーにリッチメニューを適用
async function linkRichMenu() {
    try {
        await client.linkRichMenuToUser(userId, richMenuId);
        console.log("リッチメニューをユーザーに適用しました！");
    } catch (error) {
        console.error("ユーザー適用エラー:", error.message);
    }
}

// リッチメニューのセットアップを実行する関数
async function setupRichMenu() {
    const richMenuId = await createRichMenu();
    if (richMenuId) {
        await uploadRichMenuImage(richMenuId);
        await linkRichMenuToUser(richMenuId);
    }
}

// 関数をエクスポート
module.exports = setupRichMenu;
