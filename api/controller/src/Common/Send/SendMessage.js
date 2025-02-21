const generateFlexMessage = require('../Template/generateFlexMessage.js');
const ErrorMessageJson = require('../Template/ErrorMessage.json');

exports.SendMessage = (client, event) => {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === 'チャットボット') {
        client.replyMessage(replyToken, generateFlexMessage.generateFlexMessage());
    } else {
        client.replyMessage(replyToken, ErrorMessageJson);
    }
};
