import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'articleImg03',
    theme: ['A', 'B'],
    casePanel: false,
    fields: {
        common: ['image', 'text']
    },
    popupEdit: {
        common: [
            {
                title: 'S_IMG_UPLOAD',
                type: 'imageUpload',
                name: 'image',
                size: [450, 800]
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
