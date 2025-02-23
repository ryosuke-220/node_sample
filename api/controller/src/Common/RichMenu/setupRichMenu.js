require('dotenv').config();
const axios = require("axios");
const fs = require("fs");

const LINE_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const USER_ID = process.env.USER_ID;
const IMAGE_PATH = process.env.IMAGE_PATH;

// リッチメニュー作成関数
async function createRichMenu() {
    const richMenuData = {
        size: { width: 2500, height: 1686 },
        selected: true,
        name: "Main Menu",
        chatBarText: "メニューを開く",
        areas: [
            // 上段
            {
                bounds: { x: 0, y: 0, width: 833, height: 843 },
                action: { type: "url", url="https://rispace.conohawing.com/home.php" }
            },
            {
                bounds: { x: 833, y: 0, width: 833, height: 843 },
                action: { type: "postback", data: "action=menu" }
            },
            {
                bounds: { x: 1666, y: 0, width: 834, height: 843 },
                action: { type: "postback", data: "action=coupon" }
            },
            // 下段
            {
                bounds: { x: 0, y: 843, width: 833, height: 843 },
                action: { type: "postback", data: "action=hours" }
            },
            {
                bounds: { x: 833, y: 843, width: 833, height: 843 },
                action: { type: "postback", data: "action=contact" }
            },
            {
                bounds: { x: 1666, y: 843, width: 834, height: 843 },
                action: { type: "postback", data: "action=access" }
            }
        ]
    };

    try {
        const response = await axios.post("https://api.line.me/v2/bot/richmenu", richMenuData, {
            headers: {
                Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        return response.data.richMenuId;
    } catch (error) {
        console.error("リッチメニュー作成エラー:", error.response ? error.response.data : error.message);
        return null;
    }
}

// 画像アップロード
async function uploadRichMenuImage(richMenuId) {
    try {
        const imageData = fs.readFileSync(IMAGE_PATH);
        await axios.post(`https://api.line.me/v2/bot/richmenu/${richMenuId}/content`, imageData, {
            headers: {
                Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
                "Content-Type": "image/jpeg"
            }
        });
    } catch (error) {
        console.error("❌ 画像アップロードエラー:", error.response ? error.response.data : error.message);
    }
}

// ユーザーにリッチメニューを適用
async function linkRichMenuToUser(richMenuId) {
    try {
        await axios.post(`https://api.line.me/v2/bot/user/${USER_ID}/richmenu/${richMenuId}`, {}, {
            headers: {
                Authorization: `Bearer ${LINE_ACCESS_TOKEN}`
            }
        });
    } catch (error) {
        console.error("ユーザー適用エラー:", error.response ? error.response.data : error.message);
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
