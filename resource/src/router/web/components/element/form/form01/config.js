import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'form01',
    theme: [],
    mainPanel: {
        ...commonConfig.mainPanel,
        theme: false
    },
    casePanel: false,
    fields: {
        common: ['key', 'placeholder', 'value', 'state']
    }
};

export default config;
