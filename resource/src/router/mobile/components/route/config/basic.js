export default {
    normal: {
        homeBasic: () => import(/* webpackChunkName: 'homeBasic' */'../../tpl/basic/components/home/components'),
        agLoginBasic: () => import(/* webpackChunkName: 'agLoginBasic' */'../../tpl/basic/components/agLogin/components'),
        cardBasic: () => import(/* webpackChunkName: 'cardBasic' */'../../tpl/basic/components/card/components'),
        casinoBasic: () => import(/* webpackChunkName: 'casinoBasic' */'../../tpl/basic/components/casino/components'),
        mahjongBasic: () => import(/* webpackChunkName: 'mahjongBasic' */'../../tpl/basic/components/mahjong/components'),
        changeLangBasic: () => import(/* webpackChunkName: 'changeLangBasic' */'../../tpl/basic/components/changeLang/components'),
        forgetPwdBasic: () => import(/* webpackChunkName: 'forgetPwdBasic' */'../../tpl/basic/components/forgetPwd/components'),
        joinAgentBasic: () => import(/* webpackChunkName: 'joinAgentBasic' */'../../tpl/basic/components/joinAgent/components'),
        joinMemberBasic: () => import(/* webpackChunkName: 'joinMemberBasic' */'../../tpl/basic/components/joinMember/components'),
        loginBasic: () => import(/* webpackChunkName: 'loginBasic' */'../../tpl/basic/components/login/components'),
        promotionBasic: () => import(/* webpackChunkName: 'promotionBasic' */'../../tpl/basic/components/promotion/components'),
        resetPwdBasic: () => import(/* webpackChunkName: 'resetPwdBasic' */'../../tpl/basic/components/resetPwd/components'),
        mobileDomainBasic: () => import(/* webpackChunkName: 'mobileDomainBasic' */'../../tpl/basic/components/domain/components')
    },
    mcenter: {
        homeBasic: () => import(/* webpackChunkName: 'homeBasic' */'../../tpl/basic/components/mcenter/components/home/components'),
        accountDataBasic: () => import(/* webpackChunkName: 'accountDataBasic' */'../../tpl/basic/components/mcenter/components/accountData/components'),
        bindingDeviceBasic: () => import(/* webpackChunkName: 'bindingDeviceBasic' */'../../tpl/basic/components/mcenter/components/bindingDevice/components'),
        balanceTransBasic: () => import(/* webpackChunkName: 'balanceTransBasic' */'../../tpl/basic/components/mcenter/components/balanceTrans/components'),
        bankCardBasic: () => import(/* webpackChunkName: 'bankCardBasic' */'../../tpl/basic/components/mcenter/components/bankCard/components'),
        bankRebateBasic: () => import(/* webpackChunkName: 'bankRebateBasic' */'../../tpl/basic/components/mcenter/components/bankRebate/components'),
        betRecordBasic: () => import(/* webpackChunkName: 'betRecordBasic' */'../../tpl/basic/components/mcenter/components/betRecord/components'),
        bonusAccountBasic: () => import(/* webpackChunkName: 'bonusAccountBasic' */'../../tpl/basic/components/mcenter/components/bonusAccount/components'),
        messageBasic: () => import(/* webpackChunkName: 'messageBasic' */'../../tpl/basic/components/mcenter/components/message/components'),
        moneyDetailBasic: () => import(/* webpackChunkName: 'moneyDetailBasic' */'../../tpl/basic/components/mcenter/components/moneyDetail/components'),
        informationBasic: () => import(/* webpackChunkName: 'informationBasic' */'../../tpl/basic/components/mcenter/components/information/components'),
        withdrawBasic: () => import(/* webpackChunkName: 'withdrawBasic' */'../../tpl/basic/components/mcenter/components/withdraw/components'),
        depositBasic: () => import(/* webpackChunkName: 'depositBasic' */'../../tpl/basic/components/mcenter/components/deposit/components'),
        tcenterCommissionBasic: () => import(/* webpackChunkName: 'tcenterCommissionBasic' */'../../tpl/basic/components/mcenter/components/tcenter/components/commission'),
        tcenterGameRecordBasic: () => import(/* webpackChunkName: 'tcenterGameRecordBasic' */'../../tpl/basic/components/mcenter/components/tcenter/components/gameRecord'),
        tcenterManagementBasic: () => import(/* webpackChunkName: 'tcenterManagementBasic' */'../../tpl/basic/components/mcenter/components/tcenter/components/management'),
        accountVipBasic: () => import(/* webpackChunkName: 'accountVipBasic' */'../../tpl/basic/components/mcenter/components/accountVip/components')
    },
    agcenter: {
        homeBasic: () => import(/* webpackChunkName: 'homeBasic' */'../../tpl/basic/components/agcenter/components/home/components'),
        accountDataBasic: () => import(/* webpackChunkName: 'accountDataBasic' */'../../tpl/basic/components/agcenter/components/accountData/components'),
        bankCardBasic: () => import(/* webpackChunkName: 'bankCardBasic' */'../../tpl/basic/components/agcenter/components/bankCard/components'),
        financeRewardBasic: () => import(/* webpackChunkName: 'financeRewardBasic' */'../../tpl/basic/components/agcenter/components/financeReward/components'),
        financeWithdrawBasic: () => import(/* webpackChunkName: 'financeWithdrawBasic' */'../../tpl/basic/components/agcenter/components/financeWithdraw/components'),
        gameRecordBasic: () => import(/* webpackChunkName: 'gameRecordBasic' */'../../tpl/basic/components/agcenter/components/gameRecord/components'),
        messageBasic: () => import(/* webpackChunkName: 'messageBasic' */'../../tpl/basic/components/agcenter/components/message/components'),
        postBasic: () => import(/* webpackChunkName: 'postBasic' */'../../tpl/basic/components/agcenter/components/post/components'),
        reportMemberBasic: () => import(/* webpackChunkName: 'reportMemberBasic' */'../../tpl/basic/components/agcenter/components/reportMember/components')
    }
};
