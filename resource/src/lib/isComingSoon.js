import comingSoon from '@/config/comingSoon';

/* 是否敬請期待 */
export default (systemTime, vendor) => {
    if (!comingSoon[vendor]) {
        return false;
    }

    if (Date.parse(systemTime) < Date.parse(comingSoon[vendor].endDateTime)
        && Date.parse(systemTime) > Date.parse(comingSoon[vendor].beginDateTime)) {
        return true;
    }

    return false;
};
