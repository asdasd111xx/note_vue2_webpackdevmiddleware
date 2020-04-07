import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'image01',
    max: 80,
    theme: ['A', 'B', 'C', 'D', 'E'],
    fields: {
        common: [
            'image',
            'linkType',
            'linkTo',
            'linkItem',
            'imageHover',
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft'
        ]
    },
    mainPopupEdit: {
        spaceEdit: true
    },
    popupEdit: {
        common: [
            {
                type: 'imageHoverUpload',
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [240, 400]
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            },
            {
                type: 'itemSpace',
                objKey: 'itemSpace',
                names: {
                    topSpace: 'paddingTop',
                    rightSpace: 'paddingRight',
                    bottomSpace: 'paddingBottom',
                    leftSpace: 'paddingLeft'
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
