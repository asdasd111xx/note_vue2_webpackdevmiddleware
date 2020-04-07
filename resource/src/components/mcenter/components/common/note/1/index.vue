<template>
    <transition name="fade">
        <div class="pop-note-warp pop-class">
            <div class="close-btn" @click="close()">×</div>
            <div class="title">{{ $text('S_SM_NOTE', '注意事项') }}</div>
            <div :class="['content', siteConfig.JAPAN_EXCEPTION === 'Y' && path[0] === 'mobile' ? 'left' : '']">
                <template>
                    <p>
                        {{ $text( isException ? 'POP_NOTE_ACCOUNT_COMPLETE_2' : 'POP_NOTE_ACCOUNT_COMPLETE', '请完成【我的帐户】设定') }}：
                    </p>
                </template>
                <div
                    v-if="hasAccountData"
                    class="note-account-title"
                    @click="goPage('accountData')"
                >
                    <span>{{ $text('S_ACCOUNT_DATA', '帐户资料') }}</span>
                </div>
                <template>
                    <div
                        v-for="(msg ,index) in noteMsg"
                        :key="`note-msg-${index}`"
                        class="note-msg"
                    >
                        {{ msg.text }}
                        <span
                            ref="note-text"
                            :class="['link', 'member', { 'mobile-path': isMobilePath }]"
                            @click="goPage('accountData')"
                        >
                            <br v-if="isMobilePath" />
                            <span>{{ $text('S_GO_NOW', '立即前往') }}</span>
                        </span>
                    </div>
                </template>
                <div
                    v-if="hasBankCard"
                    class="note-account-title"
                    @click="goPage('accountBankCard')"
                >
                    <span>{{ $text( isException ? 'S_BIND_BANK_2' : 'S_BIND_BANK', '绑定银行卡') }}</span>
                </div>
                <template>
                    <div
                        v-for="(msg ,index) in bankCardMsg"
                        :key="`note-msg-${index}`"
                        class="note-msg"
                    >
                        {{ msg.text }}
                        <span
                            ref="bank-card-text"
                            :class="['link', 'member', { 'mobile-path': isMobilePath }]"
                            @click="goPage('accountBankCard')"
                        >
                            <br v-if="isMobilePath" />
                            <span>{{ $text('S_GO_NOW', '立即前往') }}</span>
                        </span>
                    </div>
                </template>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import exceptionList from '@/config/exceptionList';

export default {
    props: {
        position: {
            type: String,
            default: ''
        },
        hasBankCard: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            path: this.$route.path.split('/').filter((path) => path),
            hasAccountData: true
        };
    },
    computed: {
        ...mapGetters({
            mobileCheck: 'getMobileCheck',
            siteConfig: 'getSiteConfig',
            webInfo: 'getWebInfo',
            curLang: 'getCurLang',
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo'
        }),
        // 日本站特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        },
        isMobilePath() {
            if ((this.curLang === 'zh-tw' || this.curLang === 'zh-cn') && this.path[0] === 'mobile' && window.innerWidth < 380) {
                return true;
            }
            return (this.curLang === 'ja' || this.curLang === 'en' || this.curLang === 'vi') && this.path[0] === 'mobile';
        },
        noteMsg() {
            return [
                {
                    text: this.$text(this.isException ? 'S_POP_NOTE_LIST_1' : 'POP_NOTE_LIST_1', '设定【个人姓名】'),
                    isShow: !this.memInfo.user.name
                },
                {
                    text: this.$text(this.isException ? 'S_POP_NOTE_LIST_3' : 'POP_NOTE_LIST_3', '设定【取款密码】'),
                    isShow: this.isException ? false : !this.memInfo.user.has_withdraw_password
                },
                {
                    text: this.$text('S_POP_NOTE_LIST_4', '验证【手机号码】'),
                    isShow: !this.mobileCheck ? !this.mobileCheck : false
                }
            ].filter((item) => item.isShow);
        },
        bankCardMsg() {
            return [
                {
                    text: this.$text(this.isException ? 'POP_NOTE_NUMBER_COMPLETE_2' : 'POP_NOTE_NUMBER_COMPLETE', '请完善【常用帐号】信息'),
                    isShow: this.hasBankCard
                }
            ].filter((item) => item.isShow);
        }
    },
    created() {
        const hasMobileCheck = !this.mobileCheck ? !this.mobileCheck : false;
        const hasWithdrawPassword = this.isException ? false : !this.memInfo.user.has_withdraw_password;

        if (this.memInfo.user.name && !hasWithdrawPassword && !hasMobileCheck) {
            this.hasAccountData = false;
        }
    },
    methods: {
        close() {
            this.actionSetPop();
        },
        goPage(page) {
            this.close();

            if (this.path[0] === 'mobile') {
                const path = page === 'accountData' ? 'accountData' : 'bankCard';
                this.$router.push(`/mobile/mcenter/${path}`);
                return;
            }
            this.actionChangePage({ page: 'mcenter', type: '', subPage: page });
        },
        ...mapActions([
            'actionSetPop',
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" src="../../../../css/common/note/index.scss" scoped></style>
