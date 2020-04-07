import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'image05',
    mainPanel: {
        ...commonConfig.mainPanel,
        theme: false
    },
    fields: {
        common: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        0: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem']
    },
    casePanel: {
        ...commonConfig.casePanel,
        remove: false
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
                size: [480, 420]
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
                type: 'imageHoverUpload',
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [960, 420]
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
