export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'jackpot',
        type: 'oneJackpot',
        x: '20',
        y: '72',
        w: '500',
        h: '70',
        draggable: 'Y',
        resizable: 'Y',
        borderWidth: '0',
        borderColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        rotate: '0',
        present: 'all'
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {
        preText: '总彩金',
        preFontSize: '12',
        preFontColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        endText: '元',
        endFontSize: '12',
        endFontColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        jpFontSize: '12',
        jpFontColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        vendor: 'bbin'
    },
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        minw: 450,
        minh: 50
    }
};
