<template>
    <div>
        <slot
            :title="title"
            :personal-data="personalData"
            :bank-card-data="bankCardData"
            :direct-page="directPage"
            :close="close"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import { API_BANK_CARD_CHECK } from '@/config/api';
import exceptionList from '@/config/exceptionList';

/**
 * 綁定銀行卡及取款前，資料驗證
 * @module components/common/securityVerify
 */
export default {
    data() {
        return {
            hasCommonAccount: false
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            mobileCheck: 'getMobileCheck'
        }),
        // 日本站特例判斷
        isJpException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        },
        title() {
            return this.$text(this.isJpException ? 'POP_NOTE_ACCOUNT_COMPLETE_2' : 'POP_NOTE_ACCOUNT_COMPLETE', '请完成【我的帐户】设定');
        },
        personalData() {
            const list = [
                // 個人姓名
                {
                    msg: this.$text(this.isJpException ? 'S_POP_NOTE_LIST_1' : 'POP_NOTE_LIST_1', '设定【个人姓名】'),
                    verifyFail: !this.memInfo.user.name
                },
                // 取款密碼 - 日本站需顯藏
                {
                    msg: this.$text(this.isJpException ? 'S_POP_NOTE_LIST_3' : 'POP_NOTE_LIST_3', '设定【提现密码】'),
                    verifyFail: this.isJpException ? false : !this.memInfo.user.has_withdraw_password
                },
                // 手機號碼
                {
                    msg: this.$text('S_POP_NOTE_LIST_4', '验证【手机号码】'),
                    verifyFail: !this.mobileCheck
                }
            ].filter((item) => item.verifyFail);

            return {
                type: this.$text('S_ACCOUNT_DATA', '帐户资料'),
                list
            };
        },
        bankCardData() {
            const list = [
                // 綁定銀行卡是否有常用帳戶 - 需要先填寫姓名，才顯示綁定銀行卡是否有常用帳戶的提醒
                {
                    msg: this.$text(this.isJpException ? 'POP_NOTE_NUMBER_COMPLETE_2' : 'POP_NOTE_NUMBER_COMPLETE', '请完善【常用帐号】信息'),
                    verifyFail: this.memInfo.user.name && !this.hasCommonAccount
                }
            ].filter((item) => item.verifyFail);

            return {
                type: this.$text(this.isJpException ? 'S_BIND_BANK_2' : 'S_BIND_BANK', '绑定银行卡'),
                list
            };
        }
    },
    created() {
        // 取得綁定銀行卡是否有常用帳戶
        ajax({
            method: 'get',
            url: API_BANK_CARD_CHECK,
            errorAlert: false
        }).then(
            (res) => {
                if (res && res.result === 'ok') {
                    this.hasCommonAccount = res.ret;
                }
            }
        );
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        /**
         * 關閉視窗
         * @method close
         */
        close() {
            this.actionSetPop();
        },
        /**
         * 前往設定頁面
         * @method directPage
         * @param {string}} link - 頁面 path 名稱
         */
        directPage(link) {
            this.close();
            if (this.$route.path.split('/').filter((path) => path)[0] === 'mobile') {
                const path = (link === 'accountData') ? 'accountData' : 'bankCard';
                this.$router.push(`/mobile/mcenter/${path}`);
                return;
            }
            this.actionChangePage({ page: 'mcenter', type: '', subPage: link });
        }
    }
};
</script>
