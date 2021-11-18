import axios from "axios";
import { getCookie } from "@/lib/cookie";
import querystring from "querystring";
import store from "@/store";

// 币发BIFA色站 api domain
let localDomain = localStorage.getItem("p-domain")
  ? `${localStorage.getItem("p-domain")}/api/v1`
  : "";
const PORN_DOMAIN =
  localDomain || (store && store.state && store.state.pornDomain)
    ? `${store.state.pornDomain}/api/v1`
    : "";

// 色站Lucas機器 測試站 api domain
const S_PORN_DOMAIN = "https://sexsite-api.in-app.cc/api/v1";
const enableNewApi = !!getCookie("s_enable");

export default ({
  method = "get",
  params = {},
  data = {},
  timeout = 10000,
  reqHeaders = {},
  url = "",
  fail = () => {}
}) => {
  if (!PORN_DOMAIN) {
    return new Promise(resolve => {
      resolve("error");
    });
  }

  const host = PORN_DOMAIN;
  const args = {
    jwt: getCookie("s_jwt") || "",
    videoSpaceId: getCookie("s_id") || ""
  };

  let _data = {
      ...args,
      ...data
    },
    _params = {
      ...args,
      ...params
    };

  if (enableNewApi) {
    if (method && method.toLocaleUpperCase() === "post") {
      // _data["tagId"] = _data.tag;
      // delete _data["siteId"];
      // delete _data["tag"];
    } else {
      // _params["tag"] = params.tagId;
      // delete _params["siteId"];
      // delete _params["tagId"];
    }
  }

  const obj = {
    method,
    url: host + url,
    timeout,
    headers: {
      ...reqHeaders
    },
    params: {
      ..._params
    },
    data: querystring.stringify(_data)
  };

  if (enableNewApi && method && method.toLocaleUpperCase() === "post") {
    obj["data"] = data;
  }

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
