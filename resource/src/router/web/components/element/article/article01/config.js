import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'article01',
    casePanel: false, // 注意！調整時請搜尋 shadowConfig
    casePanelStyle: {
        ...commonConfig.casePanelStyle,
        type: 'h',
        casePanelSize: 1,
        offset: {
            top: -10,
            right: 2
        }
    },
    fields: {
        common: [ // 變數命名太差，特別註解，人不在了…就讓他消失在前端的歷史文本吧
            'title', // 頁籤名稱
            'color', // 按鈕顏色
            'colorHover', // 按鈕 active 顏色
            'colorFont', // 文字顏色
            'editContentState', // 類型為連結或文案
            'linkType',
            'linkTo',
            'linkItem',
            { type: 'ckeditor', name: 'text' } // 圖文編輯器內容
        ]
    },
    theme: ['A', 'B'],
    popupEdit: {
        common: [
            {
                type: 'text',
                name: 'title',
                maxLength: 10,
                width: 224
            },
            {
                title: 'S_COLOR_FONT',
                type: 'colorPicker',
                name: 'colorFont'
            },
            {
                title: 'S_COLOR_BUTTON',
                type: 'colorPicker',
                name: 'color'
            },
            {
                title: 'S_COLOR_ACTIVE',
                type: 'colorPicker',
                name: 'colorHover'
            },
            {
                title: 'S_EDIT_TYPE',
                type: 'switcher',
                name: 'editContentState',
                fields: [
                    {
                        type: 'ckeditor',
                        title: 'S_FONT'
                    },
                    {
                        type: 'link',
                        title: 'S_LINK'
                    }
                ]
            },
            {
                type: 'ckeditor',
                name: 'text'
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
    }
};

export default config;
