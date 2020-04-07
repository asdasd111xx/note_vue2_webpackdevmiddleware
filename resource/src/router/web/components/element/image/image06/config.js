import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'image06',
    max: 80,
    theme: ['A', 'B'],
    mainPanel: {
        ...commonConfig.mainPanel
    },
    fields: {
        common: ['image', 'imageHover', 'bigImage', 'linkType', 'linkTo', 'linkItem']
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
                size: [263, 78]
            },
            {
                title: 'S_LARGE_IMAGE',
                type: 'imageUpload',
                name: 'bigImage',
                size: [724, 350]
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
