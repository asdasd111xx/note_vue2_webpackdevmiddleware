export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'lang',
        type: 'oneLangSelect',
        x: '20',
        y: '72',
        w: '125',
        h: '24',
        draggable: 'Y',
        resizable: 'Y',
        present: 'all',
        borderWidth: '0',
        borderColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        rotate: '0',
        fontColor: '{ "r":178, "g":178, "b":178, "a":1 }',
        fontHoverColor: '{ "r":178, "g":178, "b":178, "a":1 }',
        bgColor: '{ "r":0, "g":0, "b":0, "a":0 }'
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {
        shape: 'cycle',
        pattern: 'a',
        image: ''
    },
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        minw: 20,
        minh: 20
    }
};
