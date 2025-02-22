const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// CSVファイルのパス
const csvFilePath = path.resolve(__dirname, 'data.csv');

// Flexメッセージを生成する関数
function generateFlexMessage() {
  return new Promise((resolve, reject) => {
    const buttons = [];

    // CSVファイルを読み込み
    fs.createReadStream(csvFilePath)
      .pipe(csv())
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
            text: buttonResponse,
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

module.exports = generateFlexMessage;
