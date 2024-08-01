const ErrorMessageJson = require('../Template/ErrorMessage.json');

exports.SendMessage = (client, event) => {
  try {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === '#MyLibrary!') {
      client.replyMessage(replyToken, Json);
    } else {
      client.replyMessage(replyToken, ErrorMessageJson);
    }
  } catch (err) {
    console.log(err.response.data);
  }
};