//導向外部網址時，safari 會阻擋所有同步或非同步函式中的 window.open()。其中一個解法是：在函式之前，先產生 window.open()
//window.open 是 JavaScript 標準的開啟新視窗語法
//cb_resolve是ＡＰＩ 取得前台編輯資訊的Json檔 可以拿到要導轉的url
const lib_windowOpenMethod = cb_resolve => {
  // 呼叫 API 前另需視窗
  let newWindow = "";
  newWindow = window.open();

  const newWindowHref = uri => {
    try {
      newWindow.location = uri; //uri是網址(字串)//????console.log(newWindow.location == uri)..false
    } catch (e) {
      console.log(e);
      console.log(newWindow);
      console.log(uri);
    }
  };

  cb_resolve.then(uri => {
    if (uri) {
      newWindowHref(uri);
    } else {
      newWindow.close();
    }
  });
};

export default lib_windowOpenMethod;
