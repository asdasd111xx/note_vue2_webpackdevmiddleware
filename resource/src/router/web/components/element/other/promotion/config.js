import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'promotion',
    theme: ['A', 'B'],
    mainPanel: {
        ...commonConfig.mainPanel,
        copy: false
    },
    fields: {
        common: [
            'join',
            'connect',
            'pc',
            'mobile',
            'category',
            'date',
            'image',
            'card',
            'link',
            { type: 'ckeditor', name: 'text' }
        ]
    },
    popupEdit: {
        common: [
            {
                title: 'S_IMG_UPLOAD',
                type: 'imageUpload',
                setting: false,
                name: 'card',
                size: [300, 260],
                validate: {
                    required: 'S_IMG_NOT_UPLOAD'
                }
            },
            {
                title: 'S_IMG_UPLOAD',
                type: 'imageUpload',
                setting: false,
                name: 'image',
                size: [300, 260],
                validate: {
                    required: 'S_IMG_NOT_UPLOAD'
                }
            },
            {
                type: 'ckeditor',
                name: 'text'
            }
        ]
    }
};

export default config;
