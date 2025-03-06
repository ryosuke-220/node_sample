const { generateFlexMessage, getResponseText } = require('../Template/generateFlexMessage');
const ErrorMessageJson = require('../Template/ErrorMessage.json');

exports.sendMessage = async (client, event) => {
    const type = event.type;
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (type === 'post') {
        const data = event.postback.data;
        if (data === 'action=chatbot') {
            // リッチメニューの「チャットボット」ボタンが押された場合、フレックスメッセージを生成
            try {
              const flexMessage = await generateFlexMessage();
              await client.replyMessage(replyToken, flexMessage);
            } catch (error) {
              console.error('エラーが発生しました: ', error);
            }
        }
    } else {
        // ユーザーがボタンを押した場合、CSVに基づいて回答を取得
        try {
            const responseText = await getResponseText(text);
            await client.replyMessage(replyToken, {
                type: 'text',
                text: responseText,
            });
        } catch (error) {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '申し訳ありませんが、当該メッセージはサポートしていません。',
            });
        };
    }
}
