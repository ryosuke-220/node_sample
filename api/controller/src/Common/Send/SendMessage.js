const generateFlexMessage = require('../Template/generateFlexMessage');
const ErrorMessageJson = require('../Template/ErrorMessage.json');

exports.SendMessage = async (client, event) => {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === 'チャットボット') {
        try {
            const flexMessage = await generateFlexMessage(); // 非同期処理を待つ
            await client.replyMessage(replyToken, flexMessage);
        } catch (error) {
            console.error('Error generating Flex message:', error);
            await client.replyMessage(replyToken, { type: 'text', text: 'エラーが発生しました。' });
        }
    } else {
        await client.replyMessage(replyToken, ErrorMessageJson);
    }
};
