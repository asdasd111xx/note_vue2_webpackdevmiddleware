import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'articleImg02',
    max: 6,
    theme: ['A', 'B'],
    fields: {
        common: ['image', 'linkType', 'linkTo', 'linkItem'],
        0: ['title', 'text', 'imgTitle']
    },
    popupEdit: {
        common: [
            {
                title: 'S_IMG_UPLOAD',
                type: 'imageUpload',
                name: 'image',
                size: [90, 90]
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
