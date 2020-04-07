import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'article02',
    casePanel: {
        ...commonConfig.casePanel,
        remove: false
    },
    mainPanel: {
        ...commonConfig.mainPanel,
        theme: false
    },
    fields: {
        common: [
            'editContentState', // 類型為連結或文案
            { type: 'ckeditor', name: 'text' } // 圖文編輯器內容
        ]
    },
    popupEdit: {
        common: [
            {
                type: 'ckeditor',
                name: 'text'
            }
        ]
    },
    validate: {
        text: {
            required: {
                msg: 'S_TEXT_NOT_UPLOAD'
            }
        }
    }
};

export default config;
