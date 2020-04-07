<template>
    <div :class="$style['ag-list']">
        <div
            v-for="info in list"
            :key="info.pageName"
            :class="[$style.list, 'clearfix']"
            @click="onListClick(info)"
        >
            <span :class="$style.icon" />
            <span :class="$style.name">{{ info.name }}</span>
            <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/agent/icon_goto.png')" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as axios from 'axios';
import { API_QRCODE } from '@/config/api';
import ajax from '@/lib/ajax';
import agValidate from '@/lib/agValidate';

export default {
    computed: {
        ...mapGetters({
            agentInfo: 'getAgentInfo',
            isWebview: 'getIsWebview',
            agentUserLevels: 'getAgentUserLevels'
        }),
        list() {
            const { config } = this.agentInfo;
            const list = [
                { name: '用户信息', path: '/mobile/agcenter/accountData', pageName: 'accountData' }, // 用戶信息
                { name: '游戏纪录', path: '/mobile/agcenter/gameRecord', pageName: 'reportGameRecord' }, // 遊戲紀錄
                { name: '代理教程', path: '', pageName: 'agentTutorial' }, // 代理教程
                { name: '绑定银行卡', path: '/mobile/agcenter/bankCard', pageName: 'accountBankCard' }, // 綁定銀行卡
                { name: '公告', path: '/mobile/agcenter/post', pageName: 'infoPost' }, // 公告
                { name: '站內信', path: '/mobile/agcenter/message', pageName: 'infoMessage' } // 站內信
            ];

            if (config.app_is_ready && !this.isWebview) {
                // APP 下載
                list.push({ name: '下載APP', path: '/mobilebet', pageName: 'appDownload' });
            }

            return list;
        }
    },
    methods: {
        ...mapActions([
            'actionSetAgentdata',
            'actionSetPop',
            'actionSetSystemTime'
        ]),
        onListClick(item) {
            if (item.pageName === 'agentTutorial') {
                window.open('/mobile/contact', 'Contact Us');
                return;
            }

            if (item.pageName === 'appDownload') {
                ajax({
                    method: 'post',
                    url: API_QRCODE,
                    params: {
                        path: 'mobileBet'
                    },
                    errorAlert: false,
                    success: (response) => {
                        window.location.href = response.ret.url;
                    }
                });
                return;
            }

            axios.all([this.actionSetAgentdata()]).then(() => {
                // 代理強制修改密碼機制
                if (this.agentInfo.user.password_reset) {
                    return;
                }

                if (!['accountBankCard', 'financeWithdraw'].includes(item.pageName)) {
                    this.$router.push(item.path);
                    return;
                }

                // 銀行卡
                const { bank } = this.agentUserLevels;
                // 電子錢包
                const virtual = this.agentUserLevels.virtual_bank;
                // 會員帳號出款
                const user = this.agentUserLevels.bind_user;

                if (!bank && !virtual) {
                    if (!user) {
                        alert(this.$text('S_MISTAKE_CONTACT_CUSTOM_SERVICE'));
                        return;
                    }

                    // 只開啟會員帳號出款，點擊綁定銀行卡跳出錯誤訊息
                    if (item.pageName === 'accountBankCard') {
                        alert(this.$text('S_MISTAKE_BANKCARD_CUSTOM_SERVICE'));
                        return;
                    }
                }

                this.actionSetSystemTime();

                agValidate(item.pageName).then((res) => {
                    // 取款是否另開
                    if (res.message === 'withdrawIsEmbed') {
                        window.open(this.withdrawUrl, '_blank');
                        return;
                    }

                    // 帳號為停權狀態
                    if (res.message === 'isBankrupt') {
                        alert(this.$i18n.t('S_BANKRUPT_TIP'));
                        return;
                    }

                    // 未設定姓名, 未設定取款密碼, 綁定銀行卡內無常用帳號
                    if (res.message === 'noName' || res.message === 'noPassword' || res.message === 'noCommonAccount' || res.message === 'mobileDidNotPass') {
                        this.actionSetPop({ type: 'note', data: 'agent' });
                        return;
                    }

                    this.$router.push(item.path);
                });
            });
        }
    }
};
</script>

<style lang="scss" module>
.ag-list {
    background-color: #000;
}

.list {
    position: relative;
    height: 43px;
    padding: 7px 13px;
    border-bottom: 1px solid #272727;

    > img {
        float: right;
        width: 28px;
        height: 28px;
    }

    .icon {
        float: left;
        width: 28px;
        height: 28px;
    }

    .name {
        float: left;
        height: 28px;
        line-height: 28px;
        color: #F8F1EB;
        font-size: 13px;
    }
}
</style>
