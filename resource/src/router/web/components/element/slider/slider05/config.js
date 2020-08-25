import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'slider05',
    fields: {
        0: ['slider']
    },
    theme: ['A', 'B', 'C'],
    popupEdit: {
        0: [
            {
                title: 'S_NAVIGATION_POSITION',
                type: 'dropdownSetting',
                setting: true,
                name: 'navigationPos',
                options: {
                    top: 'S_TOP',
                    middle: 'S_MIDDLE',
                    bottom: 'S_BOTTOM',
                    centerBottom: 'S_CENTER_BOTTOM',
                    none: 'S_NONE'
                }
            },
            {
                title: 'S_LEFT_BUTTON',
                type: 'imageHoverUpload',
                setting: true,
                objKey: 'leftBtnImage',
                names: {
                    normal: 'leftBtnImg',
                    hover: 'leftBtnImgHover'
                },
                size: [84, 84],
                sizeLimit: [84, 84],
                sizeReminder: 'S_MAX_SIZE'
            },
            {
                title: 'S_RIGHT_BUTTON',
                type: 'imageHoverUpload',
                setting: true,
                objKey: 'rightBtnImage',
                names: {
                    normal: 'rightBtnImg',
                    hover: 'rightBtnImgHover'
                },
                size: [84, 84],
                sizeLimit: [84, 84],
                sizeReminder: 'S_MAX_SIZE'
            },
            {
                title: 'S_PAGINATION_POSITION',
                type: 'dropdownSetting',
                setting: true,
                name: 'paginationPos',
                options: {
                    left: 'S_LEFT',
                    center: 'S_CENTER',
                    right: 'S_RIGHT',
                    none: 'S_NONE'
                }
            },
            {
                title: {
                    first: 'S_PAGINATION_COLOR',
                    second: 'S_PAGINATION_COLOR_ACTIVE'
                },
                type: 'colorPickerDouble',
                setting: true,
                objKey: 'paginationColor',
                names: {
                    normal: 'paginationColor',
                    hover: 'paginationColorActive'
                }
            },
            {
                title: 'S_SLIDER_EFFECT',
                type: 'dropdownSetting',
                setting: true,
                name: 'effect',
                options: {
                    slide: 'S_SLIDE_LEFT',
                    fade: 'S_FADE'
                    // cube: 'S_CUBE',
                    // coverflow: 'S_COVERFLOW',
                    // flip: 'S_FLIP'
                }
            },
            {
                type: 'sliderImageUpload',
                name: 'slider',
                size: [1920, 765]
            }
        ]
    },
    validate: {
        leftBtnImg: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        },
        leftBtnImgHover: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        },
        rightBtnImg: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        },
        rightBtnImgHover: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        },
        slider: {
            image: {
                required: {
                    msg: 'S_IMG_NOT_UPLOAD'
                }
            }
        }
    }
};

export default config;
