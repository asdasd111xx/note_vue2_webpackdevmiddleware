const { default: member } = require("../resource/src/api/member")

後台設定
系統端=>消息與維護 (設定時間會顯示時間)
(選擇不分廳才會發消息及跳轉)

一.載入頁面時
  1.進到外層 mobile/components/index
   //   (async () => {
    //await store.dispatch("actionMemInit");

  2.設定userdata
    //await dispatch("actionSetUserdata");

  3.call /api/v1/c/player  (傳success,fail方法) 
  3.1 成功會取得會員資訊
  3.2.1. member.data 發送ajax請求 (api/v1/c/player). 
        .catch 的時候會window.location.href = "/upup"; 
        
  3.2.2. member.data本身也有一個fail方法  
          fail的時候會根據status code跳轉至對應畫面 503->/upup... //window.location.href = statusLink[code];

二.登入狀態 call餘額時
  1.  登入狀態每30s call actionSetUserBalance   //)}, 30000);
  2.  若維護會得到 "M00002" 秀吐司訊息 並reload  //case "M00002":
  3.  跑流程 一. 