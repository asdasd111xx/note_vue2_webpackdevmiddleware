import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'card',
    mainPanel: {
        ...commonConfig.mainPanel,
        sync: false
    },
    theme: [
        { text: '九鼎', value: '519', alias: ['129', '43', '27', '185'] },
        'A',
        'B'
    ]
};

export default config;
