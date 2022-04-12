const fs = require('fs');
const path = require('path');

const iframe = fs.readFileSync(path.resolve(__dirname, 'iframe.html'), 'utf8');

//1.載入express模組
let express = require('express');
// 2.使用express
let app = express();
app.get('/', function (req, res) {
  res.send(iframe);
});
app.get('/conf/domain', function (req, res) {
  res.send('/a');
});
// 5.首頁
//3.設定port位置
let port = 3000;
// 4.監聽 port
app.listen(port, () => console.log(`Listening on ${port}`));
