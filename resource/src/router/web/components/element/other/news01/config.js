import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'news01',
    theme: ['A'],
    casePanel: false,
    fields: {
        common: ['image', 'color']
    },
    mainPopupEdit: {
        spaceEdit: true
    },
    popupEdit: {
        common: [
            {
                title: 'S_IMG_UPLOAD',
                type: 'imageUpload',
                setting: false,
                name: 'image',
                size: [153, 40]
            },
            {
                title: 'S_CONTENT_COLOR',
                type: 'colorPicker',
                setting: false,
                name: 'color'
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
