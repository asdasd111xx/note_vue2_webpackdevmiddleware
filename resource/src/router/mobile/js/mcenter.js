const component = () => import(/* webpackChunkName: 'component' */'../components/route/mcenter');

export default {
    path: 'mcenter',
    name: 'mcenter',
    redirect: '/mobile/mcenter/home',
    component,
    children: [
        { // 會員中心首頁
            path: 'home',
            name: 'mcenter-home',
            component
        },
        { // 帳戶資料
            path: 'accountData/:id?',
            name: 'mcenter-accountData',
            component,
            children: [
                {
                    path: 'name',
                    name: 'mcenter-accountData-name',
                    component
                },
                {
                    path: 'email',
                    name: 'mcenter-accountData-email',
                    component
                },
                {
                    path: 'phone',
                    name: 'mcenter-accountData-phone',
                    component
                },
                {
                    path: 'qq',
                    name: 'mcenter-accountData-qq',
                    component
                },
                {
                    path: 'weixin',
                    name: 'mcenter-accountData-weixin',
                    component
                },
                // {
                //     path: 'birthday',
                //     name: 'mcenter-accountData-birthday',
                //     component
                // },
                {
                    path: 'withdrawPwd',
                    name: 'mcenter-accountData-withdrawPwd',
                    component
                },
                {
                    path: 'line',
                    name: 'mcenter-accountData-line',
                    component
                }
            ]
        },
        { // 裝置管理
            path: 'bindingDevice',
            name: 'mcenter-bindingDevice',
            component
        },
        { // 額度轉換
            path: 'balanceTrans',
            name: 'mcenter-balanceTrans',
            component
        },
        { // 额度转让
            path: 'creditTrans',
            name: 'mcenter-creditTrans',
            component
        },
        { // 綁定銀行卡
            path: 'bankCard',
            name: 'mcenter-bankCard',
            component
        },
        {
            // 歷史銀行卡/電子錢包
            path: 'historyCard',
            name: 'mcenter-historyCard',
            component
        },
        { // 我的返水
            path: 'bankRebate',
            name: 'mcenter-bankRebate',
            component
        },
        { // 投注記錄
            path: 'betRecord',
            name: 'mcenter-betRecord',
            component
        },
        { // 紅利帳戶
            path: 'bonusAccount',
            name: 'mcenter-bonusAccount',
            component
        },
        { // 資金明細
            path: 'moneyDetail/:page?',
            name: 'mcenter-moneyDetail',
            component
        },
        { // 信息中心
            path: 'information',
            name: 'mcenter-information',
            component
        },
        { // 取款
            path: 'withdraw',
            name: 'mcenter-withdraw',
            component
        },
        { // 存款
            path: 'deposit',
            name: 'mcenter-deposit',
            component
        },
        { // 意見反饋
            path: 'feedback/:page/:id?',
            name: 'mcenter-feedback',
            component
        },
        { // app分享
            path: 'share',
            name: 'mcenter-share',
            component
        },
        { // VIP中心
            path: 'vipCenter',
            name: 'mcenter-vipCenter',
            component
        },
        { // 代理合作
            path: 'cooperation',
            name: 'mcenter-cooperation',
            component
        },
        { // 選擇語系
            path: 'changeLang',
            name: 'mcenter-changeLang',
            component
        },
        { // VIP
            path: 'accountVip',
            name: 'mcenter-accountVip',
            component,
            children: [
                {
                    path: 'detail',
                    name: 'mcenter-accountVip-detail',
                    component
                }
            ]
        },
        // { // 贊助信息
        //     path: 'sponsor',
        //     name: 'mcenter-sponsor',
        //     component
        // },
        // { // 玩法教程
        //     path: 'play',
        //     name: 'mcenter-play',
        //     component
        // },
        { // 幫助中心
            path: 'help',
            name: 'mcenter-help',
            component,
            children: [
                {
                    path: 'electronic',
                    name: 'mcenter-help-electronic',
                    component
                },
                {
                    path: 'lottery',
                    name: 'mcenter-help-lottery',
                    component
                },
                {
                    path: 'question',
                    name: 'mcenter-help-question',
                    component
                },
                {
                    path: 'real',
                    name: 'mcenter-help-real',
                    component
                },
                {
                    path: 'recharge',
                    name: 'mcenter-help-recharge',
                    component
                },
                {
                    path: 'sport',
                    name: 'mcenter-help-sport',
                    component
                },

                // 幫助中心

                {
                    path: 'deposit',
                    name: 'mcenter-help-deposit',
                    component
                },
                {
                    path: 'withdraw',
                    name: 'mcenter-help-withdraw',
                    component
                },
                {
                    path: 'gameintro',
                    name: 'mcenter-help-gameintro',
                    component,
                },
                {
                    path: 'support',
                    name: 'mcenter-help-support',
                    component
                },
                {
                    path: 'contact',
                    name: 'mcenter-help-contact',
                    component
                },
                // 存取款細節頁面
                {
                    path: 'detail',
                    name: 'mcenter-help-detail',
                    component
                }
            ]
        },
        { // 關於我們
            path: 'about',
            name: 'mcenter-about',
            component,
            children: [
                {
                    path: 'sport',
                    name: 'mcenter-about-sport',
                    component
                },
                {
                    path: 'trust',
                    name: 'mcenter-about-trust',
                    component
                },
                {
                    path: 'agreement',
                    name: 'mcenter-about-agreement',
                    component
                },
                {
                    path: 'term',
                    name: 'mcenter-about-term',
                    component
                },
                {
                    path: 'privacy',
                    name: 'mcenter-about-privacy',
                    component
                }
            ]
        },
        {
            path: 'tcenter',
            name: 'mcenter-tcenter',
            component,
            redirect: '/mobile/mcenter/tcenter/management/member',
            children: [
                {
                    path: 'commission/:page',
                    name: 'mcenter-tcenter-commission',
                    component
                },
                {
                    path: 'gameRecord/:page?',
                    name: 'mcenter-tcenter-gameRecord',
                    component
                },
                {
                    path: 'management/:page?/:date?',
                    name: 'mcenter-tcenter-management',
                    component
                },
                {
                    path: 'recommendGift',
                    name: 'mcenter-tcenter-recommendGift',
                    component
                }
            ]
        },
        { // 錢包
            path: 'makeMoney',
            name: 'mcenter-makeMoney',
            component
        },
        { // 錢包
            path: 'wallet',
            name: 'mcenter-wallet',
            component
        },
        { // 設置
            path: 'setting',
            name: 'mcenter-setting',
            component
        }
    ]
};
