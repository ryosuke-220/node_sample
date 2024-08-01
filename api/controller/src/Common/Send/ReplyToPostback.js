const LibraryGuideJson = require('../Template/LibraryGuide.json');
const HelpGuideJson = require('../Template/HelpGuide.json');

exports.SendMessage = (client, event) => {
  try {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === '#案内！') {
      client.replyMessage(replyToken, LibraryGuideJson);
    } else if (text === '#ヘルプ！') {
      client.replyMessage(replyToken, HelpGuideJson);
    }
  } catch (err) {
    console.log(err.response.data);
  }
};