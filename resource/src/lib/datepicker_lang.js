/* 日曆套件-語系處理 */
export default (lang) => {
    if (lang === 'zh-tw' || lang === 'zh-cn') {
        return 'zh';
    } if (lang === 'ja') {
        return 'ja';
    }
    return 'en';
};
