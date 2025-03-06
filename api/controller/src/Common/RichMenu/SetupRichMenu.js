const fs = require("fs");
const { client } = require('../../config');
const userId = process.env.USER_ID;
const imagePath = 'RichMenu.png';

const richMenuData = {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "Main Menu",
    chatBarText: "メニューを開く",
    areas: [
        
        // 上段
        {
            bounds: { x: 0, y: 0, width: 833, height: 843 },
            action: { type: "uri", uri: "https://rispace.conohawing.com/home" }
        },
        {
            bounds: { x: 833, y: 0, width: 833, height: 843 },
            action: { type: "uri", uri: "https://rispace.conohawing.com/contact" }
        },
        {
            bounds: { x: 1666, y: 0, width: 834, height: 843 },
            action: { type: "uri", uri: "https://u.lin.ee/vyKGU9j" }
        },
        // 下段
        {
            bounds: { x: 0, y: 843, width: 833, height: 843 },
            action: { type: "uri", uri: "https://rispace.conohawing.com/news" }
        },
        {
            bounds: { x: 833, y: 843, width: 833, height: 843 },
            action: { type: "postback", data: "action=chatbot" }
        },
        {
            bounds: { x: 1666, y: 843, width: 834, height: 843 },
            action: { type: "uri", uri: "https://lin.ee/CuevDnt" }
        }
    ]
};

// リッチメニュー作成関数
async function createRichMenu(richMenuData) {
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
async function setRichMenuImage(richMenuId) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        await client.setRichMenuImage(richMenuId, imageBuffer, "image/png");
        console.log("画像アップロード成功！");
    } catch (error) {
        console.error("画像アップロードエラー:", error.message);
    }
}

// ユーザーにリッチメニューを適用
async function setDefaultRichMenu(richMenuId) {
    try {
        await client.setDefaultRichMenu(richMenuId);
        console.log("リッチメニューを適用しました！");
    } catch (error) {
        console.error("リッチメニュー適用エラー:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

// リッチメニューのセットアップを実行する関数
async function setupRichMenu() {
    const richMenuId = await createRichMenu(richMenuData);
    if (richMenuId) {
        await setRichMenuImage(richMenuId);
        await setDefaultRichMenu(richMenuId);
    }
}

// 関数をエクスポート
module.exports = setupRichMenu;
