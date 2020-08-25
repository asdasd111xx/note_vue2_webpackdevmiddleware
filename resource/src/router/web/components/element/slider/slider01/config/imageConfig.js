export default (cssId) => {
    const styleData = {
        common: [
            {
                className: `.element-wrap[${cssId}] .slick-wrap .slick-arrow.slick-prev`,
                path: '/static/image/element/slider/slider01/default/arrow_l.png'
            },
            {
                className: `.element-wrap[${cssId}] .slick-wrap .slick-arrow.slick-next`,
                path: '/static/image/element/slider/slider01/default/arrow_r.png'
            },
            {
                className: `.element-wrap[${cssId}] .slick-wrap .slick-dots li button`,
                path: '/static/image/element/slider/slider01/default/ctrl.png'
            },
            {
                className: `.element-wrap[${cssId}] .slick-wrap.theme-D .slick-arrow.slick-next`,
                path: '/static/image/element/slider/slider01/default/D_arrow_r.png'
            },
            {
                className: `.element-wrap[${cssId}] .slick-wrap.theme-D .slick-arrow.slick-prev`,
                path: '/static/image/element/slider/slider01/default/D_arrow_l.png'
            },
            // dark-grey
            {
                className: `.element-wrap.dark-grey[${cssId}] .slick-wrap .slick-arrow.slick-prev`,
                path: '/static/image/element/slider/slider01/model/5/dark_grey/arrow_l.png'
            },
            {
                className: `.element-wrap.dark-grey[${cssId}] .slick-wrap .slick-arrow.slick-next`,
                path: '/static/image/element/slider/slider01/model/5/dark_grey/arrow_r.png'
            },
            {
                className: `.element-wrap.dark-grey[${cssId}] .slick-wrap .slick-dots li button`,
                path: '/static/image/element/slider/slider01/model/5/dark_grey/ctrl.png'
            },
            // prussian-blue
            {
                className: `.element-wrap.prussian-blue[${cssId}] .slick-wrap .slick-arrow.slick-prev`,
                path: '/static/image/element/slider/slider01/model/5/prussian_blue/arrow_l.png'
            },
            {
                className: `.element-wrap.prussian-blue[${cssId}] .slick-wrap .slick-arrow.slick-next`,
                path: '/static/image/element/slider/slider01/model/5/prussian_blue/arrow_r.png'
            },
            {
                className: `.element-wrap.prussian-blue[${cssId}] .slick-wrap .slick-dots li button`,
                path: '/static/image/element/slider/slider01/model/5/prussian_blue/ctrl.png'
            }
        ]
    };

    return styleData;
};
