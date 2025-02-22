const fs = require('fs');
const path = require('path');
const csvFilePath = path.resolve(__dirname, 'data.csv');

const csv = require('csv-parser');

// CSVファイルのパス
const csvFilePath = 'data.csv';

// Flexメッセージを生成する関数
function generateFlexMessage() {
  return new Promise((resolve, reject) => {
    const buttons = [];

    // CSVファイルを読み込み
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // CSVの各行からボタンを生成
        buttons.push({
          type: 'text',
          text: row['Button Text'],
          action: {
            type: 'message',
            label: row['Button Text'],
            text: row['Response Text'],
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
                },
                {
                  type: 'text',
                  text: '知りたいことをタップしてください。',
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
