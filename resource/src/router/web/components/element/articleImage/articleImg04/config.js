import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'articleImg04',
    theme: ['A', 'B'],
    casePanelStyle: { // 注意！調整時請搜尋 shadowConfig
        type: 'h',
        casePanelSize: 1.2,
        offset: {
            top: 5,
            right: 10
        }
    },
    fields: {
        common: ['top', 'bottom', 'color', 'image', 'imageHover', 'editContentState', { type: 'ckeditor', name: 'text' }, 'slider']
    },
    mainPopupEdit: {
        spaceEdit: true
    },
    popupEdit: {
        common: [
            {
                title: 'S_TOP_SPACE',
                type: 'text',
                name: 'top',
                maxLength: 4,
                width: 224,
                validate: {
                    number: true
                }
            },
            {
                title: 'S_BOTTOM_SPACE',
                type: 'text',
                name: 'bottom',
                maxLength: 4,
                width: 224,
                validate: {
                    number: true
                }
            },
            {
                title: 'S_BACKGROUND_COLOR',
                type: 'colorPicker',
                name: 'color'
            },
            {
                type: 'imageHoverUpload',
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [1280, 173]
            },
            {
                type: 'ckeditor',
                name: 'text'
            },
            {
                type: 'sliderImageUpload',
                name: 'slider',
                size: [1280, 47]
            }
        ]
    },
    validate: {
        image: {
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
