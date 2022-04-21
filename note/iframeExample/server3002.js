const path = require('path');

//1.載入express模組
let express = require('express');
// 2.使用express
let app = express();

app.get('/', function (req, res) {
  console.log('/');

  res.redirect('https://localhost:3001/');
});

// 5.首頁
//3.設定port位置
let port = 3002;
// 4.監聽 port
app.listen(port, () => console.log(`Listening on ${port}`));
