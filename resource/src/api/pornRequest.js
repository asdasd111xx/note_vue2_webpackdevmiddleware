import axios from "axios";
import querystring from "querystring";
import store from "@/store";
import { getCookie } from "@/lib/cookie";

// 鸭博娱乐色站 api domain
const PORN_DOMAIN =
  store && store.state && store.state.pornDoamin
    ? `${store.state.pornDoamin}/api/v1`
    : "https://venzheng.com/api/v1";

// 色站Lucas機器 測試站 api domain
const S_PORN_DOMAIN = "https://sexsite-api.in-app.cc/api/v1";
const enableNewApi = window.enableNewApi;

export default ({
  method = "get",
  params = {},
  data = {},
  timeout = 10000,
  reqHeaders = {},
  url = "",
  // smallPig = false,
  fail = () => {}
}) => {
  const host = enableNewApi ? "http://104.155.239.78/api/v1" : PORN_DOMAIN;
  let _data = data;
  let _params = params;

  if (enableNewApi) {
    _data["jwt"] = getCookie("s_jwt") || "";
    _data["videoSpaceId"] = getCookie("s_id") || "";
    _data["tagId"] = _data.tag;

    _params["jwt"] = getCookie("s_jwt") || "";
    _params["videoSpaceId"] = getCookie("s_id") || "";
    _params["tagId"] = _data.tag;

    delete _params["siteId"];
    delete _params["tag"];
    delete _data["siteId"];
    delete _data["tag"];
  }

  const obj = {
    method,
    url: host + url,
    timeout,
    headers: {
      ...reqHeaders
    },
    params: {
      ...params
    },
    data: querystring.stringify(_data)
  };

  const domain =
    store &&
    store.state &&
    store.state.memInfo &&
    store.state.memInfo.user &&
    store.state.memInfo.user.domain;

  // if (domain === '500015') {
  //     obj['url'] = S_PORN_DOMAIN + url;
  // }

  // if (smallPig) {
  //     // obj['withCredentials'] = true;
  //     const domain = store &&
  //         store.state &&
  //         store.state.memInfo &&
  //         store.state.memInfo.user &&
  //         store.state.memInfo.user.domain;
  // }

  let api = window.PermissionRequest;
  if (!api) {
    window.PermissionRequest = axios.create({});
    api = window.PermissionRequest;
  }

  // setCookie('Session', '2Ses38X5WEBcSvBYJX8R5A', { path: '.cdxxx.app', sameSite: 'None' });
  return api(obj)
    .then(res => {
      if (res && res.data) {
        return res.data;
      } else {
        fail(res.data);
      }
      return res.data;
    })
    .catch(error => {
      console.log("[PORN request error]");
      console.log(error);
      return error;
    });
};
