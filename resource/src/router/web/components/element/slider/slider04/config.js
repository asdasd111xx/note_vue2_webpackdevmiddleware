import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'slider04',
    theme: ['A', 'B'],
    casePanel: {
        remove: false, // 刪除功能
        sort: false, // 排序功能
        edit: false // 編輯功能
    },
    fields: {
        0: ['jackpot'],
        1: ['slider']
    },
    mainPopupEdit: {
        spaceEdit: true
    },
    popupEdit: {
        0: [
            {
                title: 'S_IMG_UPLOAD', // 標題名稱(選填，預設值：圖片上傳)
                type: 'imageUpload', // 表單類型(固定)
                name: 'jackpotImg', // 表單名稱(必填)
                size: [214, 198], // 建議尺寸(選填)
                validate: { // 驗證表單(選填)
                    required: 'S_IMG_NOT_UPLOAD' // 驗證必填，value: 提示文字
                }
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
