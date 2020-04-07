import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'jackpot01',
    theme: ['A', 'B'],
    casePanel: {
        ...commonConfig.casePanel,
        remove: false,
        sort: false
    },
    fields: {
        common: ['title', 'colorFont', 'image', 'bgColor']
    },
    popupEdit: {
        common: [
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'colorFont'
            },
            {
                title: 'S_BACKGROUND_COLOR',
                type: 'colorPicker',
                name: 'bgColor'
            },
            {
                type: 'imageUpload',
                objKey: 'image',
                name: 'image',
                size: [700, 90]
            }
        ]
    }
};

export default config;
