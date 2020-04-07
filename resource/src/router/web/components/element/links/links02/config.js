import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'links02',
    theme: ['A'],
    casePanel: false, // 注意！調整時請搜尋 shadowConfig
    casePanelStyle: { // 注意！調整時請搜尋 shadowConfig
        type: 'h',
        casePanelSize: 1.2,
        offset: {
            top: 0,
            right: 0
        }
    },
    fields: {
        common: ['image', 'linkType', 'linkTo', 'linkItem'],
        0: ['title', 'color', 'colorHover', 'linkType', 'linkTo', 'linkItem'],
        1: ['title', 'color', 'colorHover', 'linkType', 'linkTo', 'linkItem'],
        2: ['title', 'color', 'colorHover', 'linkType', 'linkTo', 'linkItem'],
        3: ['title', 'color', 'colorHover', 'linkType', 'linkTo', 'linkItem'],
        4: ['title', 'color', 'colorHover', 'linkType', 'linkTo', 'linkItem'],
        5: ['title', 'color', 'colorHover', 'linkType', 'linkTo', 'linkItem']
    },
    popupEdit: {
        common: [
            {
                title: 'S_IMG_UPLOAD',
                type: 'imageUpload',
                name: 'image',
                size: [746, 80]
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ],
        0: [
            {
                title: 'S_TITLE',
                type: 'text',
                name: 'title'
            },
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'color'
            },
            {
                title: 'S_IMG_HOVER',
                type: 'colorPicker',
                name: 'colorHover'
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ],
        1: [
            {
                title: 'S_TITLE',
                type: 'text',
                name: 'title'
            },
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'color'
            },
            {
                title: 'S_IMG_HOVER',
                type: 'colorPicker',
                name: 'colorHover'
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ],
        2: [
            {
                title: 'S_TITLE',
                type: 'text',
                name: 'title'
            },
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'color'
            },
            {
                title: 'S_IMG_HOVER',
                type: 'colorPicker',
                name: 'colorHover'
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ],
        3: [
            {
                title: 'S_TITLE',
                type: 'text',
                name: 'title'
            },
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'color'
            },
            {
                title: 'S_IMG_HOVER',
                type: 'colorPicker',
                name: 'colorHover'
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ],
        4: [
            {
                title: 'S_TITLE',
                type: 'text',
                name: 'title'
            },
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'color'
            },
            {
                title: 'S_IMG_HOVER',
                type: 'colorPicker',
                name: 'colorHover'
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ],
        5: [
            {
                title: 'S_TITLE',
                type: 'text',
                name: 'title'
            },
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'color'
            },
            {
                title: 'S_IMG_HOVER',
                type: 'colorPicker',
                name: 'colorHover'
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ]
    },
    validate: {
        image: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        }
    }
};

export default config;
