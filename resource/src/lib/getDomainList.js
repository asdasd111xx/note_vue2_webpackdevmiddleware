import CryptoJS from "crypto-js";
import axios from "axios";
import store from "@/store";

// template
// "500015": {
//   "web": {
//     "listDomainList": [
//       "https://yaboapi.bbin-asia.com"
//     ],
//     "apiDomainList": [
//       "https://yaboapi.bbin-asia.com"
//     ]
//   },
//   "app": {
//     "listDomainList": [
//       "https://yaboapi.bbin-asia.com"
//     ],
//     "apiDomainList": [
//       "https://ybqa2-io.bbin-asia.com",
//       "https://yaboapi.bbin-asia.com"
//     ]
//   }
// },

let curConfigInfo = {};
let checkAPIDomain = false;
let checkDomainList = false;

let baseDomain;
let baseDomainLength = 0;

let isDev = process.env.NODE_ENV === "development";

export const domainListInit = async (configInfo, target = "local") => {
  isDev =
    process.env.NODE_ENV === "development" ||
    ["500015", "500035", "9999905"].includes(store.state.webDomain.domain);

  let checkDomainListTimes = 1;

  curConfigInfo = configInfo;
  checkAPIDomain = false;
  checkDomainList = false;
  baseDomain =
    target === "local"
      ? configInfo.LOCAL_BASE_DOMAIN
      : configInfo.LOCAL_JSON_DOMAIN;

  if (
    target === "local" &&
    localStorage.getItem("base-list") &&
    window.atob(localStorage.getItem("base-list"))
  ) {
    baseDomain = window.atob(localStorage.getItem("base-list")).split
      ? window.atob(localStorage.getItem("base-list")).split(",")
      : "";
  }

  baseDomainLength = baseDomain.length;

  return (async () => {
    while (
      !checkDomainList &&
      !checkAPIDomain &&
      checkDomainListTimes <= baseDomainLength
    ) {
      if (isDev) {
        console.log(
          "check domain list encrypt: ",
          baseDomain[checkDomainListTimes - 1]
        );
      }

      await getDomainListEncrypt(baseDomain[checkDomainListTimes - 1]).then(
        result => {
          if (result) {
            const webApiDomain = result;
            // if (target === "local") {
            //   return setAPIDomain(["error/test/api"].concat(webApiDomain));
            // }
            return setAPIDomain(webApiDomain);
          } else {
            checkAPIDomain = false;
          }

          checkDomainListTimes++;
        }
      );
    }

    if (isDev) {
      console.log("checkDomainList", checkDomainList);
      console.log("checkAPIDomain", checkAPIDomain);
    }

    if (target === "local") {
      // Local domain 皆不可用
      if (!checkDomainList && checkDomainListTimes >= baseDomainLength) {
        setDomainListErrorMsg(168107);
        // Local api domain 皆不可用
        return false;
      } else if (checkDomainList && !checkAPIDomain) {
        setDomainListErrorMsg(168109);
        return false;
      }
    }

    if (target === "json") {
      // remote api domain 皆不可用
      if (!checkDomainList || !checkAPIDomain) {
        setDomainListErrorMsg(168110);
        return false;
      } else if (checkDomainList && !checkAPIDomain) {
        setDomainListErrorMsg(168109);
        return false;
      }
    }

    // 檢查完成
    if (checkDomainList && checkAPIDomain) {
      if (isDev) {
        console.log("set api domain: ", curConfigInfo.YABO_GOLANG_API_DOMAIN);
      }
      return true;
    }
  })();
};

export const getDomainListEncrypt = url => {
  return axios({
    method: "get",
    url: `${url}/api-v2/xbb/DomainList/Encrypt`
  })
    .then(res => {
      if (res && res.data) {
        let base64String = decrypt(res.data.data.trim());
        base64String = base64String.replace(/[\n\r]+/g, "\\n").trim();

        const jsonResult = JSON.parse(base64String),
          webApiDomain =
            jsonResult.data[store.state.webDomain.domain].web.apiDomainList,
          listDomainList =
            jsonResult.data[store.state.webDomain.domain].web.listDomainList;
        localStorage.setItem("base-list", window.btoa(listDomainList));

        checkDomainList = true;

        if (isDev) {
          console.log("jsonResult:", jsonResult);
          console.log("webApiDomain:", webApiDomain);
        }

        return webApiDomain;
      }
    })
    .catch(() => {
      return false;
    });
};

async function setAPIDomain(allDomainList) {
  let checkTime = 0,
    limitTest = 0; // 避免迴圈

  if (!allDomainList || allDomainList.length === 0) {
    return false;
  }

  async function checkHealth() {
    if (isDev) {
      console.log("check api health");
    }
    return await axios({
      method: "get",
      url: `${allDomainList[checkTime]}/api-v2/cxbb/Health/health`
    })
      .then(res => {
        if (isDev) {
          console.log("check: ", allDomainList[checkTime]);
        }

        if (res.status === 200) {
          console.log("set:", allDomainList[checkTime]);
          curConfigInfo.YABO_GOLANG_API_DOMAIN = `${allDomainList[checkTime]}/api-v2`;
          curConfigInfo.ACTIVES_BOUNS_WEBSOCKET = `${allDomainList[
            checkTime
          ].replace("https", "wss")}`;

          checkAPIDomain = true;
          return true;
        }
        checkTime += 1;
      })
      .catch(e => {
        console.log(e);
        checkTime += 1;
        return false;
      });
  }

  return (async () => {
    while (
      !checkAPIDomain &&
      checkTime < allDomainList.length &&
      limitTest < 20
    ) {
      limitTest++;
      await checkHealth();
    }

    if (isDev) {
      console.log("check all api domian done");
    }

    if (checkAPIDomain) {
      return store.dispatch("actionSetSiteConfig", curConfigInfo);
    } else {
      return false;
    }
  })();
}

function decrypt(data) {
  const pubkey = "I15TMSLO0KXUWTHO";

  let decrypt = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(pubkey), {
    iv: CryptoJS.enc.Utf8.parse(pubkey),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  let base64String = CryptoJS.enc.Base64.stringify(decrypt);
  return atob(base64String);
}

export function setDomainListErrorMsg(code) {
  console.log(`%c 重新连线中(${code})`, "color: red; font-size:14px");
  alert(`重新连线中(${code})`);
  localStorage.setItem("api-error-code", code);

  if (code === 168110) {
    window.location.reload();
  }
}
