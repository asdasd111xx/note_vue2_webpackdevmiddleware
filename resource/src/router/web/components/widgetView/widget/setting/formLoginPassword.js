export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'memLogin',
        type: 'formLoginPassword',
        x: '20',
        y: '72',
        w: '160',
        h: '36',
        draggable: 'Y',
        resizable: 'Y',
        present: 'logout',
        borderWidth: '1',
        borderColor: '{ "r": 160, "g": 160, "b": 160, "a":1 }',
        rotate: '0',
        radius: '0',
        fontSize: '12',
        fontColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        useImage: 'N',
        bgColor: '{ "r": 255, "g": 255, "b": 255, "a":1 }',
        image: ''
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {
        placeholderText: '密码'
    },
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        limit: 1, // 限制產生在模塊的數量
        minw: 20,
        minh: 20
    }
};
