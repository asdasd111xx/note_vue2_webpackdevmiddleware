import aesjs from 'AES-JS'
import axios from 'axios';
const base64abc = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
];
function bytesToBase64(bytes) {
    let result = '', i, l = bytes.length;
    for (i = 2; i < l; i += 3) {
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
        result += base64abc[bytes[i] & 0x3F];
    }
    if (i === l + 1) { // 1 octet yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[(bytes[i - 2] & 0x03) << 4];
        result += "==";
    }
    if (i === l) { // 2 octets yet to write
        result += base64abc[bytes[i - 2] >> 2];
        result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
        result += base64abc[(bytes[i - 1] & 0x0F) << 2];
        result += "=";
    }
    return result;
}

function getImageType(data) {
    if (data.charAt(0) == '/') {
        return "image/jpeg";
    } else if (data.charAt(0) == 'R') {
        return "image/gif";
    } else if (data.charAt(0) == 'i') {
        return "image/png";
    }
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            var bytes = reader.result
            var uint8View = new Uint8Array(bytes);
            callback(uint8View);
        }
        reader.readAsArrayBuffer(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

export const getEncryptImage = (info) => {
    if (!document.querySelector(`img[img-id="${info.id}"]`)) {
        return;
    }

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
            var bytes = reader.result
            var dataUrl = new Uint8Array(bytes);

            // 16進制轉換
            var key = aesjs.utils.hex.toBytes(data.key)
            var iv = aesjs.utils.hex.toBytes(data.iv)

            var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
            var decryptedBytes = aesCbc.decrypt(dataUrl);
            var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

            var base64String = bytesToBase64(decryptedBytes);
            var type = getImageType(base64String)

            // 放回image src
            if (!document.querySelector(`img[img-id="${info.id}"]`)) {
                return;
            }

            document.querySelector(`img[img-id="${info.id}"]`).src = `data:${type};base64,${base64String}`;
        });

        reader.readAsArrayBuffer(response.data);
        return;
    });
};
