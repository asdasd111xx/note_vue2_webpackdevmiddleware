<template>
    <div class="ag-list">
        <div
            v-for="listInfo in list"
            :key="`list-${listInfo.pageName}`"
            class="list"
            @click="onListClick(listInfo)"
        >
            <span>{{ $t(listInfo.name) }}</span>
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_goto_n.png')" />
            <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_goto_h.png')" class="is-active" />
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
                { name: 'S_MEM_GAME_RECORD', path: '/mobile/agcenter/gameRecord', pageName: 'reportGameRecord' }, // 會員遊戲紀錄
                { name: 'S_ACCOUNT_DATA', path: '/mobile/agcenter/accountData', pageName: 'accountData' }, // 帳戶資料
                { name: 'S_BIND_BANK', path: '/mobile/agcenter/bankCard', pageName: 'accountBankCard' }, // 綁定銀行卡
                { name: 'S_PERSONAL_MESSAGE', path: '/mobile/agcenter/message', pageName: 'infoMessage' }, // 站內信
                { name: 'S_HOT_NEWS', path: '/mobile/agcenter/post', pageName: 'infoPost' }, // 公告
                { name: 'S_FEEDBACK', path: '/mobile/agcenter/feedBack', pageName: 'feedBack' } // 意见反馈
            ];

            if (config.app_is_ready && !this.isWebview) {
                // APP 下載
                list.push({ name: 'S_APP_DOWNLOAD', path: '/mobilebet', pageName: 'appDownload' });
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

<style lang="scss" src="../css/agList.scss" scoped></style>
