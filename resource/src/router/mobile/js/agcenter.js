const component = () => import(/* webpackChunkName: 'component' */'../components/route/agcenter');

export default {
    path: 'agcenter',
    name: 'agcenter',
    redirect: '/mobile/agcenter/home',
    component,
    children: [
        { // 代理中心首頁
            path: 'home',
            name: 'agcenter-home',
            component
        },
        { // 帳戶資料
            path: 'accountData',
            name: 'agcenter-accountData',
            component
        },
        { // 綁定銀行卡
            path: 'bankCard',
            name: 'agcenter-bankCard',
            component
        },
        { // 佣金明細
            path: 'financeReward',
            name: 'agcenter-financeReward',
            component
        },
        { // 取款
            path: 'financeWithdraw',
            name: 'agcenter-financeWithdraw',
            component
        },
        { // 會員遊戲記錄
            path: 'gameRecord',
            name: 'agcenter-gameRecord',
            component
        },
        { // 站內信
            path: 'message',
            name: 'agcenter-message',
            component
        },
        { // 公告
            path: 'post',
            name: 'agcenter-post',
            component
        },
        { // 意見反饋
            path: 'feedBack',
            name: 'agcenter-feedBack',
            component
        },
        { // 會員列表
            path: 'reportMember',
            name: 'agcenter-reportMember',
            component
        }
    ]
};
