import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'fisharea',
    theme: [
        { text: '九鼎', value: '519', alias: ['129', '43', '27', '185'] },
        'A'
    ],
    mainPanel: {
        ...commonConfig.mainPanel,
        sync: false // 同步至
    },
    caseLang: false,
    fields: {
        common: ['vendor', 'gameType']
    }
};

export default config;
