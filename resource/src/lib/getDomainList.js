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
export const getDomainListEncrypt = (url, configInfo) => {
  let isDev =
    process.env.NODE_ENV === "development" ||
    ["500015", "500035", "9999905"].includes(store.state.webDomain.domain);

  curConfigInfo = configInfo;
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
        localStorage.setItem("base-list-domain", btoa(listDomainList));

        if (isDev) {
          console.log("jsonResult:", jsonResult);
          console.log("webApiDomain:", webApiDomain);
        }

        if (webApiDomain) {
          return setAPIDomain(webApiDomain);
        } else {
          return false;
        }
      }
    })
    .catch(() => {
      return false;
    });
};
function setAPIDomain(allDomainList) {
  let checkDomain = false,
    checkTime = 0,
    limitTest = 0; // 避免迴圈

  let isDev =
    process.env.NODE_ENV === "development" ||
    ["500015", "500035", "9999905"].includes(store.state.webDomain.domain);

  async function checkHealth() {
    return await axios({
      method: "get",
      url: `${allDomainList[checkTime]}/api-v2/cxbb/Health/health`
    })
      .then(res => {
        if (res.status === 200) {
          curConfigInfo.YABO_GOLANG_API_DOMAIN = `${allDomainList[checkTime]}/api-v2`;
          curConfigInfo.ACTIVES_BOUNS_WEBSOCKET = `${allDomainList[
            checkTime
          ].replace("https", "wss")}`;

          if (isDev) {
            console.log("checkTime: ", checkTime);
            console.log(
              "set api domain: ",
              curConfigInfo.YABO_GOLANG_API_DOMAIN
            );
          }

          checkDomain = true;
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
    while (!checkDomain && checkTime < allDomainList.length && limitTest < 20) {
      limitTest++;
      await checkHealth();
    }

    if (isDev) {
      console.log("check all api domian done");
    }

    if (checkDomain) {
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
