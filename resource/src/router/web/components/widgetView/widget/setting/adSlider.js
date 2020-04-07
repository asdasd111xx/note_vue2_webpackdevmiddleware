export default {
    /**
     * widget 的基本設定，無語系
     */
    widget: {
        category: 'slider',
        type: 'adSlider',
        x: '20',
        y: '72',
        w: '500',
        h: '150',
        draggable: 'Y',
        resizable: 'Y',
        present: 'all',
        rotate: '0',
        navBtn: 'Y',
        prevW: '60',
        prevH: '60',
        prevX: '0',
        prevY: '45',
        prevImage: '',
        prevImageHover: '',
        nextW: '60',
        nextH: '60',
        nextX: '440',
        nextY: '45',
        nextImage: '',
        nextImageHover: '',
        pageBtn: 'Y',
        pageX: '150',
        pageY: '100',
        pageW: '200',
        pageH: '30',
        pageColor: '{ "r": 0, "g": 0, "b": 0, "a": 0.2 }',
        pageCurrentColor: '{ "r": 0, "g": 122, "b": 255, "a": 1 }'
    },
    /**
     * 存入 case data 並且有語系
     */
    data: {
        slides: '[]'
    },
    /**
     * config 的資料僅作為 widget 的限制設定，不會存到 store
     */
    config: {
        minw: 120,
        minh: 120
    }
};
