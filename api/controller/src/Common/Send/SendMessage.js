const { generateFlexMessage, getResponseText } = require('../Template/generateFlexMessage');
const ErrorMessageJson = require('../Template/ErrorMessage.json');

exports.SendMessage = async (client, event) => {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === 'チャットボット') {
        // リッチメニューの「チャットボット」ボタンが押された場合、フレックスメッセージを生成
        try {
          const flexMessage = await generateFlexMessage();
          await client.replyMessage(event.replyToken, flexMessage);
        } catch (error) {
          console.error('エラーが発生しました: ', error);
        }
    } else {
        // ユーザーがボタンを押した場合、CSVに基づいて回答を取得
        try {
            const responseText = await getResponseText(text);
            await client.replyMessage(event.replyToken, {
                type: 'text',
                text: responseText,
            });
        } catch (error) {
            await client.replyMessage(event.replyToken, {
                type: 'text',
                text: '申し訳ありませんが、当該メッセージははサポートしていません。',
            });
        };
    }
}

async function getResponseText(messageText) {
    return new Promise((resolve, reject) => {
        const csvFilePath = path.join(__dirname, '../Template/responses.csv'); // CSVのパス
        const results = {};

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                results[row['質問']] = row['回答']; // CSVの1列目をキー、2列目を値として保存
            })
            .on('end', () => {
                resolve(results[messageText] || "申し訳ありませんが、該当する回答が見つかりません。");
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
