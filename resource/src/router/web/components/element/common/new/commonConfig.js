const config = {
    name: '', // 模塊名稱
    max: 8, // 可新增的最大數量
    theme: [], // 佈局種類
    /* theme example
    thtme: ['A', 'B', 'C']
    theme: [
        { text: '九鼎', value: '519', alias: ['129', '27', '185'] },
        'A'
    ]
    */

    // 模塊設定按鈕關開，若要全面關閉，則將此物件設為 false
    mainPanel: {
        setting: true, // 設置
        copy: true, // 複製至
        sync: true, // 同步至
        theme: true // 佈局
    },

    // 模塊項目設定按鈕開關，若要全面關閉，則將此物件設為 false
    casePanel: {
        remove: true, // 刪除功能
        sort: true, // 排序功能
        edit: true // 編輯功能
    },

    // 模塊項目樣式
    casePanelStyle: {
        type: 'v', // 水平：h, 垂直：v
        casePanelSize: 1.2, // icon 大小
        offset: { // 偏移量
            top: 5,
            right: 10
        }
    },

    // case 資料是否有需要語系設定
    caseLang: true,

    // 儲存欄位名稱
    fields: {
        /*
        common: [
            'title', 'image', 'linkType', 'linkTo', 'linkItem' // 儲存資料欄位
            { type: 'ckeditor', name: 'text' }                 // 若為圖文編輯器，因資料存 content，使用特例格式
        ]
        0: ['image']                                           // 特例儲存資料欄位(key 為儲存資料區的索引值)
        */
    },

    // 背景彈出式編輯視窗欄位
    mainPopupEdit: {
        spaceEdit: false // 間距設定
    },

    // 彈出式編輯視窗欄位
    popupEdit: {
        /*
        common: [
            文字輸入框範例
            {
                title: 'S_TITLE', // 標題名稱(選填，預設值：標題)
                type: 'text',     // 表單類型(固定)
                setting: false,   // 表單儲存類型（true => caseSetting, false => caseData )
                name: 'title'     // 表單名稱(必填)
                maxLength: 6,     // 文字最大長度(選填，預設值：50)
                width: 224,       // 輸入框寬度(選填，單位：px)
                unit: true        // 單位欄位(選填, 預設值：false)
                validate: {       // 輸入驗證(可依需求自行增加，再到inputText加入判斷)(因輪播圖需求才加在這，正常應加在下方欄位驗證裡)
                    number: true  // 限制輸入數字
                }
            }
            ckeditor 範例
            {
                type: 'ckeditor', // 表單類型(固定)
                name: 'text'      // 表單名稱（必填）
            },
            圖片上傳範例
            {
                title: 'S_IMG_UPLOAD',           // 標題名稱(選填，預設值：圖片上傳)
                type: 'imageUpload',             // 表單類型(固定)
                setting: false,                  // 表單儲存類型（true => caseSetting, false => caseData )
                name: 'image',                   // 表單名稱(必填)
                size: [300, 260],                // 建議尺寸(選填)
                validate: {                      // 驗證表單(選填)
                    required: 'S_IMG_NOT_UPLOAD' // 驗證必填，value: 提示文字
                }
            },
            圖片上傳範例(hover)
            {
                title: 'S_LARG_IMG_UPLOAD', // 標題名稱(選填，預設值：圖片上傳)
                type: 'imageHoverUpload',   // 表單類型(固定)
                setting: false,             // 表單儲存類型（true => caseSetting, false => caseData )
                objKey: 'image',            // 物件 key 名稱，用來包裹 names 的值(必填)
                names: {
                    normal: 'largImg',      // 一般圖(必填)
                    hover: 'largImgHover'   // hover 圖(必填)
                },
                size: [960, 640]            // 建議尺寸(選填)
            },
            連結選擇範例
            {
                type: 'link',         // 表單類型(固定)
                setting: false,       // 表單儲存類型（true => caseSetting, false => caseData )
                objKey: 'link',       // 物件 key 名稱，用來包裹 names 的值(必填)
                names: {
                    type: 'linkType', // 連結類型(必填)
                    to: 'linkTo',     // 連結目標(必填)
                    item: 'linkItem'  // 連結細項(必填)
                }
            },
            顏色選擇器範例
            {
                title: 'S_BACKGROUND_COLOR', // 標題名稱(選填，預設值：背景顏色)
                type: 'colorPicker',         // 表單類型(固定)
                setting: false,              // 表單儲存類型（true => caseSetting, false => caseData )
                name: 'color'                // 表單名稱(必填)
            },
            顏色選擇器範例(hover)
            {
                title: {
                    first: 'S_PAGINATION_COLOR',        // 標題名稱(選填，預設值：分頁器滑入顏色)
                    second: 'S_PAGINATION_COLOR_ACTIVE' // 標題名稱(選填，預設值：分頁器滑入顏色)
                },
                type: 'colorPickerDouble',              // 表單類型(固定)
                setting: false,                         // 表單儲存類型（true => caseSetting, false => caseData )
                objKey: 'paginationColor',              // 物件 key 名稱，用來包裹 names 的值(必填)
                names: {
                    normal: 'paginationColor',          // 一般顏色(選填，預設值：白色)
                    hover: 'paginationColorActive'      // hover 顏色(選填，預設值：深灰 #3C3C3C)
                }
            },
            顯示欄位切換範例(注意：目前功能不能使用多個 switcher)
            {
                title: 'S_EDIT_TYPE', // 標題名稱(選填，預設值：編輯方式)
                type: 'switcher',     // 表單類型(固定)
                setting: false,       // 表單儲存類型（true => caseSetting, false => caseData )
                name: 'status',       // 表單名稱(必填)
                fields: [
                    {
                        type: 'ckeditor', // 切換類型(固定：根據 field 的 type)
                        title: 'S_FONT'   // radio button 文字
                    },
                    {
                        type: 'link',
                        title: 'S_LINK'
                    }
                ]
            },
            項目間距輸入表範例
            {
                type: 'itemSpace',
                objKey: 'itemSpace',
                names: {
                    topSpace: 'paddingTop',        // 上內距
                    rightSpace: 'paddingRight',    // 右內距
                    bottomSpace: 'paddingBottom',  // 下內距
                    leftSpace: 'paddingLeft'       // 左內距
                }
            },
            下拉式選單範例, 針對 Element Case Setting 設定
            {
                title: 'S_SLIDER_EFFECT', // 標題名稱(必填)
                type: 'dropdownSetting',  // 表單類型(固定)
                setting: false,           // 表單儲存類型（true => caseSetting, false => caseData )
                name: 'effect',           // 表單名稱(必填)
                options: {                // 標題名稱(設定資料内容 key: value)
                    slide: 'S_Slide',
                    fade: 'S_FADE',
                    cube: 'S_CUBE',
                    coverflow: 'S_COVERFLOW',
                    flip: 'S_FLIP'
                }
            },
            圖片上傳 & 連結選擇範例(注意: 主要針對多筆資料處理)
            {
                type: 'sliderImageUpload',  // 表單類型(固定)
                name: 'slider',          // 表單名稱(必填)
            }
        ],
        0: [] // 特例儲存資料欄位(key 為儲存資料區的索引值)
        */
    },
    // 欄位驗證
    validate: {
        /*
        image: {                         // 欄位 name 值
            required: {                  // 驗證必填
                msg: 'S_IMG_NOT_UPLOAD'  // 提示文字(必填)
            }
        }
        */
    }
};

export default config;
