import express from "express";

const app = express();

const port = process.env.PORT || 8080; // port番号を指定

app.post("/webhook", (req, res) => {
  res.send("準備中");
});

app.listen(port);

console.log("listen on port " + port);