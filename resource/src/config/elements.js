// 組件列表
export const elementInfo = [
    /* possible setting example
        category: 'hall', 分類
        value: 'casino', 存到 db 的值
        name: 'S_COMPONENT_HALL_CASINO', 模塊名稱
        limit: 1, 當前頁面可設定該模塊的最大數量
        kind: 3, 遊戲類要設定
        new: '2019/01/20', 新模塊標示，值為日期，表示要下架的日期
        beta: '2019/01/20' 新模塊標示，值為日期，表示要下架的日期
    */
    // widget
    {
        category: 'widget',
        value: 'widget',
        name: 'S_WIDGET',
        beta: true
    },
    // article
    {
        category: 'article',
        value: 'article01',
        name: 'S_COMPONENT_ARTICLE_01'
    },
    {
        category: 'article',
        value: 'article02',
        name: 'S_COMPONENT_ARTICLE_02'
    },
    // articleImg
    {
        category: 'articleImg',
        value: 'articleImg01',
        name: 'S_COMPONENT_ARTICLEIMG_01'
    },
    {
        category: 'articleImg',
        value: 'articleImg02',
        name: 'S_COMPONENT_ARTICLEIMG_02'
    },
    {
        category: 'articleImg',
        value: 'articleImg03',
        name: 'S_COMPONENT_ARTICLEIMG_03'
    },
    {
        category: 'articleImg',
        value: 'articleImg04',
        name: 'S_COMPONENT_ARTICLEIMG_04'
    },
    {
        category: 'articleImg',
        value: 'articleImg06',
        name: 'S_COMPONENT_ARTICLEIMG_06'
    },
    // image
    {
        category: 'image',
        value: 'image01',
        name: 'S_COMPONENT_IMAGE_01'
    },
    {
        category: 'image',
        value: 'image02',
        name: 'S_COMPONENT_IMAGE_02'
    },
    {
        category: 'image',
        value: 'image03',
        name: 'S_COMPONENT_IMAGE_03'
    },
    {
        category: 'image',
        value: 'image04',
        name: 'S_COMPONENT_IMAGE_04'
    },
    {
        category: 'image',
        value: 'image05',
        name: 'S_COMPONENT_IMAGE_05'
    },
    {
        category: 'image',
        value: 'image06',
        name: 'S_COMPONENT_IMAGE_06'
    },
    // slider
    {
        category: 'slider',
        value: 'slider05',
        name: 'S_COMPONENT_SLIDER_05'
    },
    {
        category: 'slider',
        value: 'slider02',
        name: 'S_COMPONENT_SLIDER_02'
    },
    {
        category: 'slider',
        value: 'slider03',
        name: 'S_COMPONENT_SLIDER_03'
    },
    {
        category: 'slider',
        value: 'slider04',
        name: 'S_COMPONENT_SLIDER_04'
    },
    {
        category: 'slider',
        value: 'slider07',
        name: 'S_COMPONENT_SLIDER_07'
    },
    // links
    {
        category: 'links',
        value: 'links01',
        name: 'S_COMPONENT_LINKS_01'
    },
    {
        category: 'links',
        value: 'links02',
        name: 'S_COMPONENT_LINKS_02'
    },
    // form
    {
        category: 'form',
        value: 'form01',
        name: 'S_COMPONENT_FORM_01'
    },
    // hall
    {
        category: 'hall',
        value: 'gameList',
        name: 'S_COMPONENT_HALL_GAMELIST'
    },
    {
        category: 'hall',
        value: 'casino',
        name: 'S_COMPONENT_HALL_CASINO',
        limit: 1,
        kind: 3
    },
    {
        category: 'hall',
        value: 'card',
        name: 'S_COMPONENT_HALL_KY',
        limit: 1,
        kind: 5
    },
    {
        category: 'hall',
        value: 'fisharea',
        name: 'S_COMPONENT_HALL_FISHAREA',
        limit: 1
    },
    {
        category: 'hall',
        value: 'customizedRecommandedGameList',
        name: 'S_COMPONENT_HALL_CUSTOMIZED_GAMELIST',
        limit: 1
    },
    {
        category: 'hall',
        value: 'mahjong',
        name: 'S_COMPONENT_HALL_MJ',
        limit: 1,
        kind: 6
    },
    // other
    {
        category: 'other',
        value: 'jackpot01',
        name: 'S_COMPONENT_JACKPOT_01'
    },
    {
        category: 'other',
        value: 'jackpot02',
        name: 'S_COMPONENT_JACKPOT_02'
    },
    {
        category: 'other',
        value: 'news01',
        name: 'S_COMPONENT_NEWS_01'
    },
    {
        category: 'other',
        value: 'promotion',
        name: 'S_COMPONENT_PROMOTION_02'
    }
];

export const tags = [
    {
        tag: 'new',
        name: 'S_COMPONENT_NEW', // 新模塊
        data: [] // new 的 data 不用設定，會由程式自行更新 data
    },
    {
        tag: 'entry',
        name: 'S_GAME_ENTRY_POINT', // 指定遊戲入口
        data: [
            'articleImg03',
            'slider04',
            'slider07',
            'gameList',
            'casino',
            'ky',
            'fisharea',
            'customizedRecommandedGameList',
            'jackpot02',
            'mahjong'
        ]
    },
    {
        tag: 'help',
        name: 'S_HELP_CENTER', // 幫助中心
        data: [
            'article01',
            'articleImg02',
            'image01'
        ]
    },
    {
        tag: 'image',
        name: 'S_GAME_IMAGE_HALL', // 遊戲形象大廳
        data: [
            'articleImg01',
            'image02',
            'image03',
            'image04',
            'image05',
            'slider02',
            'slider07',
            'ky'
        ]
    },
    {
        tag: 'about',
        name: 'S_ABOUT_US', // 關於我們
        data: [
            'article01',
            'articleImg02',
            'articleImg03',
            'image05',
            'links01',
            'form01'
        ]
    },
    {
        tag: 'nav',
        name: 'S_FOOTER_NAV', // 頁尾連結導航
        data: [
            'article02',
            'articleImg06',
            'links01'
        ]
    },
    {
        tag: 'ad',
        name: 'S_AD', // 活動廣告
        data: [
            'articleImg03',
            'image04',
            'image06',
            'slider05',
            'slider02',
            'slider03',
            'links02'
        ]
    },
    {
        tag: 'promotion',
        name: 'S_COMPONENT_PROMOTION_01', // 營銷板塊
        data: ['articleImg04']
    },
    {
        tag: 'func',
        name: 'S_COMPONENT_FUNC', // 功能板塊
        data: [
            'jackpot01',
            'news01'
        ]
    }
];
