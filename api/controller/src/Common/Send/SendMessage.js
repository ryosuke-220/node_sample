const generateFlexMessage = require('../Template/generateFlexMessage');
const ErrorMessageJson = require('../Template/ErrorMessage.json');

exports.SendMessage = async (client, event) => {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === 'チャットボット') {
        // ユーザーが「チャットボット」と送信した場合、フレックスメッセージを生成
        try {
          const flexMessage = await generateFlexMessage();
          await client.replyMessage(event.replyToken, flexMessage);
        } catch (error) {
          console.error('エラーが発生しました: ', error);
        }
    } else {
        // ユーザーがボタンを押した場合、そのテキストに対応するレスポンステキストを取得
        try {
            const responseText = await getResponseText(event.message.text);
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
