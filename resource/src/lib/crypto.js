import aesjs from "aes-js";
import axios from "axios";
function getImageType(data) {
  if (data.charAt(0) == "/") {
    return "image/jpeg";
  } else if (data.charAt(0) == "R") {
    return "image/gif";
  } else if (data.charAt(0) == "i") {
    return "image/png";
  }
}

export const getEncryptImage = info => {
  if (!document.querySelector(`img[img-id="${info.id}"]`)) {
    return info.image;
  }

  if (!info.image_IV || !info.image_key) {
    document.querySelector(`img[img-id="${info.id}"]`).src = info.image;
    return info.image;
  }

  const data = {
    image: info.image,
    iv: info.image_IV,
    key: info.image_key
    // file: info.image_new,
    // bak: info.image_bak,
  };

  // let encryptedHexStr = CryptoJS.enc.Hex.parse(data.image.split('?')[0]);
  // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  // console.log(data.image.split('?')[0])
  return axios({
    url: data.image.includes("?") ? data.image.split("?")[0] : data.image,
    method: "GET",
    responseType: "blob"
  }).then(response => {
    if (!document.querySelector(`img[img-id="${info.id}"]`)) {
      return info.image;
    }

    const reader = new FileReader();
    reader.addEventListener("loadend", e => {
      if (!document.querySelector(`img[img-id="${info.id}"]`)) {
        return info.image;
      }
      var bytes = reader.result;
      var dataUrl = new Uint8Array(bytes);

      // 16進制轉換
      var key = aesjs.utils.hex.toBytes(data.key);
      var iv = aesjs.utils.hex.toBytes(data.iv);

      var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
      var decryptedBytes = aesCbc.decrypt(dataUrl);
      // var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

      // var base64String = bytesToBase64(decryptedBytes);
      var base64String = btoa(
        decryptedBytes.reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      var type = getImageType(base64String);
      // 放回image src
      if (!document.querySelector(`img[img-id="${info.id}"]`)) {
        return info.image;
      }
      let imageNodeList = document.querySelectorAll(`img[img-id="${info.id}"]`);
      imageNodeList.forEach(element => {
        element.src = `data:${type};base64,${base64String}`;
      });
    });

    reader.readAsArrayBuffer(response.data);
    return;
  });
};
