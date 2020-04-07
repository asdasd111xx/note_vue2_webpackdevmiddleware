import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'image02',
    theme: ['A', 'B'],
    fields: {
        common: ['image', 'linkType', 'linkTo', 'linkItem']
    },
    casePanel: {
        ...commonConfig.casePanel,
        remove: false
    },
    popupEdit: {
        common: [
            {
                type: 'imageUpload',
                objKey: 'image',
                name: 'image',
                size: [300, 300]
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
                type: 'imageUpload',
                objKey: 'image',
                name: 'image',
                size: [600, 601]
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
