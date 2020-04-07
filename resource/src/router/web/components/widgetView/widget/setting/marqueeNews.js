export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'news',
        type: 'marqueeNews',
        x: '20',
        y: '72',
        w: '150',
        h: '26',
        draggable: 'Y',
        resizable: 'Y',
        present: 'all',
        borderWidth: '0',
        borderColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        rotate: '0'
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {
        fontSize: '12',
        color: '{ "r":0, "g":0, "b":0, "a":1 }',
        colorHover: '{ "r":0, "g":0, "b":0, "a":1 }',
        speed: '85',
        direction: 'up'
    },
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        minw: 20,
        minh: 20
    }
};
