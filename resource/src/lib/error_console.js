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
export const apiErrorAlarm = () => {};
