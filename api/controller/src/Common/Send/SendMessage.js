const fs = require('fs');
const csv = require('csv-parser');

const ErrorMessageJson = require('../Template/ErrorMessage.json');

// CSVファイルのパス
const csvFilePath = 'path/to/your/csvfile.csv';

// CSVを読み込んでFlexメッセージを生成
function generateFlexMessage() {
  const buttons = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
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

      // 生成したFlexメッセージを返す
      return flexMessage;
    });
}

exports.SendMessage = (client, event) => {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === 'チャットボット') {
        client.replyMessage(replyToken, generateFlexMessage());
    } else {
        client.replyMessage(replyToken, ErrorMessageJson);
    }
};
