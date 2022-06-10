import CryptoJS from "crypto-js";
import axios from "axios";
import store from "@/store";

const pubkey = "I15TMSLO0KXUWTHO";
let curConfigInfo = {};
export const getDomainJson = configInfo => {
  (async () => {
    curConfigInfo = configInfo;
    return await axios({
      method: "get",
      url: configInfo.DOMAIN_LIST_JSON[0]
    })
      .then(res => {
        if (res && res.data) {
          let base64String = AESDecrypt(res.data.aes.trim());
          base64String = base64String.replace(/[\n\r]+/g, "\\n").trim();

          const jsonResult = JSON.parse(base64String);
          console.log("jsonResult:", jsonResult);
          if (
            jsonResult[store.state.webDomain.domain] &&
            jsonResult[store.state.webDomain.domain].web
          ) {
            (async () => {
              await setDomain(jsonResult[store.state.webDomain.domain].web);

              console.log("return:", curConfigInfo);
              return curConfigInfo;
            })();
          } else {
          }
        }
      })
      .catch(error => {
        return error;
      });
  })();
};

function AESDecrypt(data) {
  let decrypt = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(pubkey), {
    iv: CryptoJS.enc.Utf8.parse(pubkey),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  let base64String = CryptoJS.enc.Base64.stringify(decrypt);
  return atob(base64String);
}

function setDomain(allDomainList) {
  let domainCheck = false;
  let domainIdx = 0;

  return axios({
    method: "get",
    url: `${allDomainList[domainIdx]}/api-v2/cxbb/Health/health`
  }).then(res => {
    if (res.status === 200) {
      curConfigInfo.YABO_GOLANG_API_DOMAIN = `${allDomainList[domainIdx]}/api-v2`;
      curConfigInfo.ACTIVES_BOUNS_WEBSOCKET = `${allDomainList[
        domainIdx
      ].replace("https", "wss")}`;
      domainIdx += 1;
      domainCheck = true;
    } else {
      domainIdx += 1;
    }
  });

  // while (!domainCheck && domainIdx < allDomainList.length) {

  // }
}
