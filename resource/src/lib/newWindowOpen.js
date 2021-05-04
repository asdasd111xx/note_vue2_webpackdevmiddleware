const lib_windowOpenMethod = cb_resolve => {
  // 呼叫 API 前另需視窗
  let newWindow = "";
  newWindow = window.open();

  const newWindowHref = uri => {
    try {
      newWindow.location = uri;
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
