export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'memLogin',
        type: 'formLoginCode',
        x: '20',
        y: '72',
        w: '75',
        h: '25',
        draggable: 'Y',
        resizable: 'Y',
        present: 'logout'
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {},
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        limit: 1, // 限制產生在模塊的數量
        minw: 20,
        minh: 20
    }
};
