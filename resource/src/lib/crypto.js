import CryptoJS from 'crypto-js';
import axios from 'axios';

export const getEncryptImage = (info) => {
    if (!info.image_IV || !info.image_key) {
        return info.image
    }

    const data = {
        image: info.image,
        iv: info.image_IV,
        key: info.image_key,
        // file: info.image_new,
        // bak: info.image_bak,
    }

    // let encryptedHexStr = CryptoJS.enc.Hex.parse(data.image.split('?')[0]);
    // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    // console.log(data.image.split('?')[0])

    return axios({
        url: data.image.split('?')[0],
        // url: data.image,
        method: 'GET',
        // responseType: 'blob',
    }).then((response) => {
        // const url = window.URL.createObjectURL(new Blob([response.data]));

        // var reader = new FileReader();

        // reader.addEventListener("load", function () {
        //     console.log(reader.result)

        // }, false);

        // reader.readAsDataURL(url);
        // console.log(img)

        // 讀取檔案
        let img = CryptoJS.enc.Hex.parse(response.data);

        // key iv 16進位轉化
        const key = CryptoJS.enc.Utf8.parse(data.key);
        const iv = CryptoJS.enc.Utf8.parse(data.iv);

        const key2 = CryptoJS.enc.Hex.parse(data.key);
        const iv2 = CryptoJS.enc.Hex.parse(data.iv);

        // 解密
        let decrypt = CryptoJS.AES.decrypt(img, key2,
            {
                iv: iv2,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.NoPadding
            }
        );

        let base64 = '';
        base64 = CryptoJS.enc.Base64.stringify(decrypt);

        console.log(decrypt);
        console.log('Base64:', base64)
        // 測試
        // base64 = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png';
        document.querySelector(`img[img-id="${info.id}"]`).src = 'data:image/jpg;base64,' + base64;
    });
};
