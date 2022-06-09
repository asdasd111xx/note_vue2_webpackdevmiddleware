import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
import axios from "axios";
import store from "@/store";

export const getDomainJson = configInfo => {
  let test =
    "0bYwaipqo1fy737NGUFqgtHSCRGLzEMt5QsTcEhTsepXXbUevvV3tEuswiaMHltV5ds+lx8pXodGA1gRnAC9lUkCFmXz3/bBCm05veRmIeDdN9vo7kCe4RtYNVTZHqevK7Q5yfGOvmAnJ+AfdC+/2gcYOuBFNaHFBg17jA+L+PZ9qQA9Bt6QqbNmldw+UYYPxWNcGhBm2p2o56KpvOo5LKs2PnBR/ibWw1pJXVfOp4FvRvx7VWuw72H1wO6zjNebStOnfQTq4fhFk4i+5Nod4p+qo5lVd6fQWbgS08qMlrTXJcgVNznlHKWVj/t9fYCh8IZ55dRaQJmz9W0nlNenP4vmtdSjOTWBNeshGMdpJj8OjacUx2Y3BPvov56FBj2pzSW+jTNWmMLEssIEsUg+dSFLOhs7FX7/5XWmr3wgbdEEosIpa2CmClX/2ZkJsyMSXvPZ8i8ZuDGIR9hdn4cmZ/YzFM6/4+0op7UhQTkTKKs6I175ZuGTtZ7cgqEIcpCMAsECNqyv7c3qrrKGnD4U+GisesqQC+T4u42E3NhFF+o=";

  axios({
    method: "get",
    url: configInfo.DOMAIN_LIST_JSON[0]
  })
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    });

  let base64String = AESDecrypt(test);
  console.log(base64String);
  const jsonResult = JSON.parse(`${base64String.trim()}`);
  console.log(jsonResult);
};

const pubkey = "I15TMSLO0KXUWTHO";

function AESDecrypt(data) {
  let decrypt = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(pubkey), {
    iv: CryptoJS.enc.Utf8.parse(pubkey),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });

  let base64String = CryptoJS.enc.Base64.stringify(decrypt);
  return atob(base64String);
}
