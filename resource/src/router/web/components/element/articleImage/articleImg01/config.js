import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'articleImg01',
    fields: {
        common: ['title', 'image', 'linkType', 'linkTo', 'linkItem', 'imageHover']
    },
    theme: ['A', 'B'],
    popupEdit: {
        common: [
            {
                type: 'imageHoverUpload',
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [300, 260]
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
