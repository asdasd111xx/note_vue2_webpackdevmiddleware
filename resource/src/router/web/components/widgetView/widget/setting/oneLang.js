export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'lang',
        type: 'oneLang',
        x: '20',
        y: '72',
        w: '150',
        h: '24',
        draggable: 'Y',
        resizable: 'Y',
        present: 'all',
        rotate: '0'
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {
        shape: 'cycle',
        pattern: 'a'
    },
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        minw: 20,
        minh: 20
    }
};
