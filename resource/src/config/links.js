import games from '@/config/games';

export default {
    // 連結類型
    type: [
        { value: 'internal', label: 'S_CEP_IN_LINK', mShow: false }, // 內部連結
        { value: 'static', label: 'S_STATIC_LINK', mShow: true }, // 固定連結
        { value: 'external', label: 'S_CEP_OUT_LINK', mShow: true }, // 外部連結
        { value: 'games', label: 'S_GAME_LINK', mShow: true }, // 遊戲連結
        { value: 'nolink', label: 'S_CEP_NO_LINK', mShow: true } // 空白連結
    ],
    // 固定連結
    static: [
        {
            value: 'promotion', label: 'S_AG_PROMO', mShow: true, relLogin: false
        }, // 優惠
        {
            value: 'join', label: 'S_JOIN_MEMBER', mShow: true, relLogin: false
        }, // 加入會員
        {
            value: 'joinAgent', label: 'S_JOIN_AGENT', mShow: true, relLogin: false
        }, // 加入代理
        {
            value: 'agreement', label: 'S_AGREEMENT', mShow: false, relLogin: false
        }, // 協議與規則
        {
            value: 'service', label: 'S_CUSTOMER_SERVICE_ONLINE', mShow: true, relLogin: false
        }, // 在線客服
        {
            value: 'deposit', label: 'S_DEPOSIT', mShow: true, relLogin: false
        }, // 存款
        {
            value: 'withdraw', label: 'S_WITHDRAW', mShow: true, relLogin: false
        }, // 取款
        {
            value: 'bankRebate', label: 'S_MYREBATE', mShow: true, relLogin: false
        }, // 我的返水
        {
            value: 'ubb', label: 'S_UB_BROWSER', mShow: true, relLogin: false
        }, // 寰宇瀏覽器
        {
            value: 'casino', label: 'S_HALL_CASINO', mShow: true, relLogin: false
        }, // 電子大廳
        {
            value: 'card', label: 'S_HALL_CARD', mShow: true, relLogin: false
        }, // 棋牌大廳
        {
            value: 'mahjong', label: 'S_HALL_MAHJONG', mShow: true, relLogin: false
        }, // 麻將大廳
        {
            value: 'agLogin', label: 'S_AGENT_LOGIN', mShow: true, relLogin: false
        }, // 代理登入
        {
            value: 'mobileBet', label: 'S_MOBILE_BET', mShow: true, relLogin: false
        }, // 手機下注
        {
            value: 'logOut', label: 'S_MEMBER_LOGOUT', mShow: true, relLogin: true
        }, // 會員登出
        {
            value: 'forgetPW', label: 'S_PASSWORD_FORGET', mShow: true, relLogin: true
        }, // 忘記密碼
        {
            value: 'domain', label: 'S_BACKUP_DOMAIN', mShow: true, relLogin: false
        }, // 備用網址
        { // BB電子千萬派對
            stime: '2019-03-13 12:00:00',
            etime: '2019-03-27 09:00:00',
            value: 'festivalCasinoBBParty',
            label: 'S_FESTIVAL_CASINO_BB_PARTY',
            vendor: 'bbin',
            id: 11,
            mShow: true,
            relLogin: false
        }
        // 活動用參考格式，例如︰BB電子中秋活動
        // {
        //     stime: '2018-09-18 12:00:00',
        //     etime: '2018-09-26 11:59:59',
        //     value: 'festivalCasinoBBMidAutumn',
        //     label: 'S_FESTIVAL_CASINO_BB_MID_AUTUMN',
        //     vendor: 'bbin',
        //     id: 11,    (only bbin)
        //     mShow: false,
        //     relLogin: false
        // }
    ],
    // 遊戲連結(從設定檔組遊戲連結)
    games: Object.keys(games).map((gameName) => ({ value: gameName, label: games[gameName].text }))
};
