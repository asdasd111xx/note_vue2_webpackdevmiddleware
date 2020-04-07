export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'text',
        type: 'oneTextLink',
        x: '20',
        y: '90',
        w: '150',
        h: '26',
        draggable: 'Y',
        resizable: 'Y',
        borderWidth: '0',
        borderColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        textColor: '{ "r":0, "g":0, "b":0, "a":1 }',
        textHover: '{ "r":0, "g":0, "b":0, "a":1 }',
        rotate: '0'
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {
        text: '',
        linkType: 'nolink',
        linkTo: '',
        linkItem: '',
        fontSize: '16'
    },
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        minw: 20,
        minh: 20
    }
};
