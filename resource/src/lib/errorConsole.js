// 程式錯誤報錯
export const errorAlarm = (title, errorMsg) => {
    const style = 'background-color: #D00; color: #FFF;';
    const color = 'color: #D00;';
    /* eslint-disable */
    console.group(`%c -------------------- ${title} ------------------- `, style);
    errorMsg.forEach((msg) => {
        console.log(`%c ${msg} `, color);
    });
    console.groupEnd();
    /* eslint-enable */
};

// API 錯誤報錯
export const apiErrorAlarm = ({ url, response, error }) => {
    const department = url.search('/api/v1/') < 0 ? 1 : 5;
    const style = 'background-color: #D00; color: #FFF;';
    const color = 'color: #D00;';
    let data;
    let status;
    let code;
    let message;

    if (response) {
        data = response.data;
        status = response.status;
        code = data.code;
        message = data.msg || data.message;
    }

    if (error && error.response) {
        data = error;
        status = error.response.status;
        code = error.response.data.code;
        message = error.response.data.msg || error.response.data.message;
    } else if (error && error.request) {
        data = error;
        status = error.code;
        message = error.message;
    } else {
        data = error;
    }

    /* eslint-disable */
    console.group('%c -------------------- API ERROR ------------------- ', style);
    console.log(`%c API URL: ${url} `, color);
    console.log(`%c DEPARTMENT: ${department} `, color);
    if (status) {
        console.log(`%c NET STATUS: ${status} ${status === 'ECONNABORTED' ? '(timeout)' : ''} `, color);
    }

    if (code) {
        console.log(`%c ERROR CODE: ${code} `, color);
    }

    if (message) {
        console.log(`%c ERROR MESSAGE: ${message} `, color);
    }

    if (data) {
        console.log(`%c RESPONSE:`, color, data);
    }

    console.groupEnd();
    /* eslint-enable */
};
