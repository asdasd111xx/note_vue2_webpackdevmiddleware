import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'customizedRecommandedGameList',
    // 模塊設定按鈕關開，若要全面關閉，則將此物件設為 false
    mainPanel: {
        ...commonConfig.mainPanel,
        sync: false // 同步至
    },
    caseLang: false,
    theme: ['A', 'B']
};

export default config;
