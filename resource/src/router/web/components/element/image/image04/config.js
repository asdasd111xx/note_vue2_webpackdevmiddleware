import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'image04',
    mainPanel: {
        ...commonConfig.mainPanel,
        setting: false,
        theme: false
    },
    casePanel: {
        ...commonConfig.casePanel,
        remove: false
    },
    fields: {
        common: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem']
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
