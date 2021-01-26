import { PORN_DOMAIN, S_PORN_DOMAIN } from "@/api/config";

import axios from "axios";
import querystring from "querystring";
import store from "@/store";

export default ({
  method = "get",
  params = {},
  data = {},
  timeout = 30000,
  reqHeaders = {},
  url = "",
  // smallPig = false,
  fail = () => {}
}) => {
  const obj = {
    method,
    url: PORN_DOMAIN + url,
    timeout,
    headers: {
      ...reqHeaders
    },
    params: {
      ...params
    },
    data: querystring.stringify(data)
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
  console.log(api);
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
      console.log(error.response);
      return error;
    });
};
