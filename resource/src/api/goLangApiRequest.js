import axios from "axios";
import { getCookie } from "@/lib/cookie";
import store from "@/store";

export default ({
  method = "get",
  params = {},
  urlParams = null,
  timeout = 20000,
  headers = {},
  url = ""
}) => {
  // YABO_API_DOMAIN: 'https://yaboapi.bbin-asia.com/api',
  // YABO_API_DOMAIN: 'https://yaboapi.canarycherrytart.com/api',
  // console.log(store.state.BBosDomain);
  const yaboParams = {
    // "lang": "zh-cn"
  };
  if (urlParams) {
    let query = "";
    for (let [key, value] of Object.entries(urlParams)) {
      query += `&${key}=${value}`;
    }
    url = url + "?" + query;
  }

  let _headers = {
    ...headers,
    cid: getCookie("cid") || "",
    kind: getCookie("platform") || "h",
    "x-domain": store.state.webDomain.domain
  };

  // if (!url.includes("GetAuthorizationToken")) {
  //   _headers["AuthToken"] = getCookie("y_token");
  // }

  const obj = {
    method,
    url,
    timeout,
    headers: {
      ..._headers,
      ...headers
    },
    params: {},
    data: {}
  };

  // 語系預設簡中
  if (!params["lang"]) {
    params["lang"] = "zh-cn";
  }

  // 不需要formdata params
  if (method === "post" || method === "put" || method === "delete") {
    obj.data = { ...yaboParams, ...params };
  } else {
    obj.params = { ...yaboParams, ...params };
  }

  return axios(obj)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response);
      return error;
    });
};
