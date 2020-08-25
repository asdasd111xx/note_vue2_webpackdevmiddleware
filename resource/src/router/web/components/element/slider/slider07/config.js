import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'slider07',
    theme: ['A'],
    casePanel: {
        remove: false, // 刪除功能
        sort: false, // 排序功能
        edit: false // 編輯功能
    },
    fields: {
        0: ['slider']
    },
    popupEdit: {
        0: [
            {
                title: 'S_LEFT_BUTTON',
                type: 'imageHoverUpload',
                setting: true,
                objKey: 'leftBtnImage',
                names: {
                    normal: 'leftBtnImg',
                    hover: 'leftBtnImgHover'
                },
                size: [77, 117],
                sizeLimit: [77, 117],
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
                size: [77, 117],
                sizeLimit: [77, 117],
                sizeReminder: 'S_MAX_SIZE'
            },
            {
                title: 'S_PLAY_BUTTON',
                type: 'imageHoverUpload',
                setting: true,
                objKey: 'playBtnImage',
                names: {
                    normal: 'playBtnImg',
                    hover: 'playBtnImgHover'
                },
                size: [368, 164],
                sizeLimit: [368, 164],
                sizeReminder: 'S_MAX_SIZE'
            },
            {
                title: 'S_SLIDER_WIDTH',
                type: 'text',
                setting: true,
                name: 'width',
                maxLength: 4,
                width: 224,
                validate: {
                    number: true
                }
            },
            {
                title: 'S_SLIDER_HEIGHT',
                type: 'text',
                setting: true,
                name: 'height',
                maxLength: 4,
                width: 224,
                validate: {
                    number: true
                }
            },
            {
                type: 'sliderImageUpload',
                name: 'slider',
                size: [559, 550]
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
        playBtnImg: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        },
        playBtnImgHover: {
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
