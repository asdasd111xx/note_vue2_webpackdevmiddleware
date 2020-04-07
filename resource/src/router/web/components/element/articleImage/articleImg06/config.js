import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'articleImg06',
    theme: ['A'],
    fields: {
        common: ['title', 'image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        0: ['editContentState', { type: 'ckeditor', name: 'text' }],
        1: ['title'],
        2: ['title', 'linkType', 'linkTo', 'linkItem'],
        3: ['title', 'linkType', 'linkTo', 'linkItem'],
        4: ['title', 'linkType', 'linkTo', 'linkItem'],
        5: ['title', 'linkType', 'linkTo', 'linkItem'],
        6: ['title', 'linkType', 'linkTo', 'linkItem'],
        7: ['title', 'linkType', 'linkTo', 'linkItem'],
        8: ['title'],
        9: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        10: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        11: ['title'],
        12: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        13: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        14: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        15: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        16: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        17: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem']
    },
    popupEdit: {
        common: [
            {
                title: 'S_TITLE',
                type: 'text',
                setting: false,
                name: 'title',
                maxLength: 6,
                width: 224
            }
        ],
        0: [
            {
                type: 'ckeditor',
                name: 'text'
            }
        ],
        2: [
            {
                title: 'S_TITLE',
                type: 'text',
                setting: false,
                name: 'title',
                maxLength: 6,
                width: 224
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
                setting: false,
                name: 'title',
                maxLength: 6,
                width: 224
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
                setting: false,
                name: 'title',
                maxLength: 6,
                width: 224
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
                setting: false,
                name: 'title',
                maxLength: 6,
                width: 224
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
        6: [
            {
                title: 'S_TITLE',
                type: 'text',
                setting: false,
                name: 'title',
                maxLength: 6,
                width: 224
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
        7: [
            {
                title: 'S_TITLE',
                type: 'text',
                setting: false,
                name: 'title',
                maxLength: 6,
                width: 224
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
        9: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [317, 77]
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
        10: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [317, 77]
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
        12: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [35, 62]
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
        13: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [35, 62]
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
        14: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [35, 62]
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
        15: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [35, 62]
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
        16: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [35, 62]
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
        17: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                setting: false,
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [35, 62]
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
