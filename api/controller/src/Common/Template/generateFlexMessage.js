const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// CSVファイルのパス
const csvFilePath = path.resolve(__dirname, 'data.csv');

// Flexメッセージを生成する関数
async function generateFlexMessage() {
  const buttons = [];
  
  // CSVファイルを読み込む
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv({ headers: false }))
      .on('data', (row) => {
        // CSVの各行からボタンを生成
        const buttonText = row[Object.keys(row)[0]]; // 1列目（例: 開店時間, 定休日）
        const buttonResponse = row[Object.keys(row)[1]]; // 2列目（例: 10:00-18:00, 火、土）

        // CSVの各行からボタンを生成
        buttons.push({
          type: 'text',
          text: buttonText,
          action: {
            type: 'message',
            label: buttonText,
            text: buttonText,
          },
          color: '#42659a',
          margin: '10px',
        });
      })
      .on('end', () => {
        // 全てのボタンが読み込まれた後、Flexメッセージを作成
        const flexMessage = {
          type: 'flex',
          altText: 'カフェ利用案内',
          contents: {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'カフェ利用案内',
                  weight: 'bold',
                  size: 'xl',
                  contents: []
                },
                {
                  type: 'text',
                  text: '知りたいことをタップしてください。',
                  action: {
                        "type": "message",
                        "label": "action",
                        "text": "hello"
                  },
                  wrap: true,
                },
              ],
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: buttons,
              paddingTop: '0px',
            },
          },
        };

        // Flexメッセージを返す
        resolve(flexMessage);
      })
      .on('error', (error) => {
        // エラー発生時に拒否
        reject(error);
      });
  });
}

// ユーザーのメッセージに対応するテキストを返す
async function getResponseText(userMessage) {
  return new Promise((resolve, reject) => {
    // CSVを再度読み込み、ユーザーのメッセージに一致する応答を検索
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row[Object.keys(row)[0]] === userMessage) {
          // ユーザーのメッセージと一致する場合、2列目の応答を返す
          found = true;
          resolve(row[Object.keys(row)[1]]);
        }
      })
      .on('end', () => {
        // 見つからなかった場合はエラーを返す
        if (!found) {
          reject('該当する情報がありません');
        }  
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = { generateFlexMessage, getResponseText };
