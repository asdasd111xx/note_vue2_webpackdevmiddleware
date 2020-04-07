/* eslint-disable import/prefer-default-export */
/**
 * 取得 cookie 值，未帶參數則回傳全部
 * @param {String} cookieName 要取得值的 key
 */
export const getCookie = (cookieName) => {
    const cookieArr = document.cookie.split(';');
    const result = {};

    cookieArr.forEach((info) => {
        const tmp = info.trim().split('=');
        const [index, value] = tmp;
        result[index] = value;
    });

    return cookieName ? result[cookieName] : result;
};

// export const setCookie = (cookieName, cookieValue, exdays) => {
// 因開發時程很趕…還沒寫
// };
