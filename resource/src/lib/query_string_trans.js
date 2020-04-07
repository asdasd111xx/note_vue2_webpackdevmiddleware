// 網址參數轉換
export default (url, key) => {
    // 判斷是否有參數
    if (!url.includes('?')) {
        return '';
    }

    const query = url.split('?')[1];
    const params = query.split('&');
    const result = {};

    params.forEach((param) => {
        const info = param.split('=');
        const [index, value] = info;
        result[index] = value;
    });

    if (key) {
        if (result[key]) {
            return result[key];
        }

        return '';
    }

    return result;
};
