/* 轉換背景position設定 */
export default (val) => {
    let posVal;
    switch (val) {
        case 'lt':
            posVal = '0 0';
            break;
        case 'ct':
            posVal = '50% 0';
            break;
        case 'rt':
            posVal = '100% 0';
            break;
        case 'lc':
            posVal = '0 50%';
            break;
        case 'cc':
            posVal = '50% 50%';
            break;
        case 'rc':
            posVal = '100% 50%';
            break;
        case 'lb':
            posVal = '0 100%';
            break;
        case 'cb':
            posVal = '50% 100%';
            break;
        case 'rb':
            posVal = '100% 100%';
            break;
        default:
    }
    return posVal;
};
