export default (cssId) => {
    const styleData = {
        common: [
            {
                className: `.element-wrap .slick-container[${cssId}] .slick-wrap .slick-arrow.slick-prev`,
                path: '/static/image/element/slider/slider02/default/arrow_l.png'
            },
            {
                className: `.element-wrap .slick-container[${cssId}] .slick-wrap .slick-arrow.slick-next`,
                path: '/static/image/element/slider/slider02/default/arrow_r.png'
            },
            {
                className: `.element-wrap .slick-container[${cssId}] .slick-wrap .slick-dots li button`,
                path: '/static/image/element/slider/slider02/default/ctrl.png'
            },
            // beige
            {
                className: `.element-wrap.beige .slick-container[${cssId}] .slick-wrap .slick-arrow.slick-prev`,
                path: '/static/image/element/slider/slider02/model/6/beige/arrow.png'
            },
            {
                className: `.element-wrap.beige .slick-container[${cssId}] .slick-wrap .slick-arrow.slick-next`,
                path: '/static/image/element/slider/slider02/model/6/beige/arrow.png'
            },
            {
                className: `.element-wrap.beige .slick-container[${cssId}] .slick-wrap .slick-dots li button`,
                path: '/static/image/element/slider/slider02/model/6/beige/ctrl.png'
            },
            // turquoise
            {
                className: `.element-wrap.turquoise .slick-container[${cssId}] .slick-wrap .slick-arrow.slick-prev`,
                path: '/static/image/element/slider/slider02/model/6/turquoise/arrow.png'
            },
            {
                className: `.element-wrap.turquoise .slick-container[${cssId}] .slick-wrap .slick-arrow.slick-next`,
                path: '/static/image/element/slider/slider02/model/6/turquoise/arrow.png'
            },
            {
                className: `.element-wrap.turquoise .slick-container[${cssId}] .slick-wrap .slick-dots li button`,
                path: '/static/image/element/slider/slider02/model/6/turquoise/ctrl.png'
            }
        ]
    };

    return styleData;
};
