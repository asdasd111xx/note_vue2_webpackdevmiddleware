import Vue from 'vue';

/* 轉美東時間 */
export default (dateTime, formatType = 'YYYY-MM-DD HH:mm:ss', datepicker) => {
    let temp = Vue.moment(dateTime).utcOffset(-4);

    // 若為套件, 則回傳 new Date 格式 (時間計算特例)
    if (datepicker) {
        temp = Vue.moment(dateTime).add(dateTime.getTimezoneOffset(), 'minutes').add(-4, 'hours');
        return new Date(Date.parse(temp.format(formatType)));
    }

    return temp.format(formatType);
};
