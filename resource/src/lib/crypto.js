import CryptoJS from 'crypto-js';
import axios from 'axios';
function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index = 0, word, i;
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}
export const getEncryptImage = (info) => {
    if (!info.image_IV || !info.image_key) {
        document.querySelector(`img[img-id="${info.id}"]`).src = info.image;
        return info.image;
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
        method: 'GET',
        responseType: 'blob',
    }).then((response) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
            let key = CryptoJS.enc.Hex.parse(data.key); // 16進制
            let iv = CryptoJS.enc.Hex.parse(data.iv);

            // let key = data.key;
            // let iv = data.iv;

            // let key = CryptoJS.enc.Utf8.parse(data.key); // Utf8
            // let iv = CryptoJS.enc.Utf8.parse(data.iv);

            // let key = CryptoJS.enc.Base64.parse(data.key); // Base64
            // let iv = CryptoJS.enc.Base64.parse(data.iv);

            let decrypted = CryptoJS.AES.decrypt(reader.result, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.NoPadding
            });

            // var dcBase64String = decrypted.toString(CryptoJS.enc.Base64).toString(CryptoJS.enc.Utf8);
            // console.log(dcBase64String);

            var typedArray = convertWordArrayToUint8Array(decrypted);

            // 轉換file
            var fileDec = new Blob([typedArray], { type: 'image/png' });

            console.log('decrypted:', decrypted)
            console.log('fileDec:', fileDec)

            // 轉換blob
            const url = window.URL.createObjectURL(fileDec);
            // const url = window.URL.createObjectURL(new Blob([decrypted], { type: 'image/png' }));

            document.querySelector(`img[img-id="${info.id}"]`).src = url;
            // document.querySelector(`img[img-id="${info.id}"]`).src = 'data:image/png;base64,' + dcBase64String;
            // window.URL.revokeObjectURL(url);
        });

        reader.readAsDataURL(response.data);
        return;
    });
};
