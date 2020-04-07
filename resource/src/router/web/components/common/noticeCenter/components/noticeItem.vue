<template>
    <div :class="[$noticeStyle['notice-wrap']]" @click="changePage">
        <div :class="$noticeStyle['progress-bar']" />
        <img :class="$noticeStyle['icon-img']" :src="`/static/image/common/noticeCenter/icon_${msgConfig[msg.type].imgType}.png`" />
        <div :class="$noticeStyle['notice-text']">{{ msg.text }}</div>
        <div :class="$noticeStyle['close-btn']" @click.stop="$emit('deleMsg', msg.id)" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as axios from 'axios';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';
import agValidate from '@/lib/agValidate';

export default {
    props: {
        msg: {
            type: Object,
            default: () => ({})
        },
        // eslint-disable-next-line vue/prop-name-casing
        $noticeStyle: {
            type: Object,
            default: () => ({})
        },
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            msgConfig: {
                player_deposit: {
                    pageName: 'bankMoneyDetail',
                    imgType: 'money',
                    mobilePath: '/mobile/mcenter/moneyDetail',
                    pcPath: '/page/mcenter/bankMoneyDetail'
                },
                player_withdraw: {
                    pageName: 'bankMoneyDetail',
                    imgType: 'money',
                    mobilePath: '/mobile/mcenter/moneyDetail',
                    pcPath: '/page/mcenter/bankMoneyDetail'
                },
                agent_withdraw: {
                    pageName: 'financeWithdraw',
                    imgType: 'money',
                    mobilePath: '/mobile/agcenter/financeWithdraw',
                    pcPath: '/agent/financeWithdraw'
                },
                player_rebate: {
                    pageName: 'bankMoneyDetail',
                    imgType: 'money',
                    mobilePath: '/mobile/mcenter/moneyDetail',
                    pcPath: '/page/mcenter/bankMoneyDetail'
                },
                player_activity: {
                    pageName: 'bankMoneyDetail',
                    imgType: 'money',
                    mobilePath: '/mobile/mcenter/moneyDetail',
                    pcPath: '/page/mcenter/bankMoneyDetail'
                },
                player_inbox: {
                    pageName: 'infoMessage',
                    imgType: 'mail',
                    mobilePath: '/mobile/mcenter/message',
                    pcPath: '/page/mcenter/infoMessage'
                },
                agent_inbox: {
                    pageName: 'infoMessage',
                    imgType: 'mail',
                    mobilePath: '/mobile/agcenter/message',
                    pcPath: '/agent/infoMessage'
                },
                all_player_inbox: {
                    pageName: 'infoMessage',
                    imgType: 'mail',
                    mobilePath: '/mobile/mcenter/message',
                    pcPath: '/page/mcenter/infoMessage'
                },
                all_agent_inbox: {
                    pageName: 'infoMessage',
                    imgType: 'mail',
                    mobilePath: '/mobile/agcenter/message',
                    pcPath: '/agent/infoMessage'
                },
                player_feedback_reply: {
                    pageName: 'feedBack',
                    imgType: 'mail',
                    mobilePath: '/mobile/mcenter/information/feedback?type=mailbox',
                    pcPath: '/page/mcenter/feedBack?type=mailbox'
                },
                agent_feedback_reply: {
                    pageName: 'feedBack',
                    imgType: 'mail',
                    mobilePath: '/mobile/agcenter/feedBack?type=mailbox',
                    pcPath: '/agent/feedBack?type=mailbox'
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            agentIsLogin: 'getAgentIsLogin',
            agentUserLevels: 'getAgentUserLevels'
        }),
        url() {
            const url = this.msgConfig[this.msg.type];
            if (this.isMobile) {
                return url.mobilePath;
            }

            return url.pcPath;
        }
    },
    mounted() {
        this.timeHandler();
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetAgentdata',
            'actionSetSystemTime',
            'actionSetUserBalance'
        ]),

        /**
         * 推播計時器
         * @method timeHandler
         */
        timeHandler() {
            setTimeout(() => {
                this.$emit('deleMsg', this.msg.id);

                if (this.msg.type === 'player_deposit') {
                    this.actionSetUserBalance();
                }
            }, 5000);
        },
        changePage() {
            this.$emit('deleMsg', this.msg.id);
            const item = this.msgConfig[this.msg.type];
            // 代理中心導頁
            if (this.agentIsLogin) {
                this.agCenterChangePage(item);
                return;
            }

            // 如入款點擊後自動更新
            if (this.msg.type === 'player_deposit') {
                this.actionSetUserBalance();
            }

            // 會員中心導頁
            mcenterPageAuthControl(item.pageName).then((response) => {
                if (response && response.status) {
                    this.$router.push({ path: `${this.url}` });

                    if (this.$route.query.type === 'mailbox') {
                        window.location.reload();
                    }
                }
            });
        },
        /**
         * 代理中心導頁機制
         * @method agCenterChangePage
         */
        agCenterChangePage(item) {
            if (this.msg.type !== 'agent_withdraw') {
                this.$router.push({ path: `${this.url}` });
                return;
            }

            axios.all([this.actionSetAgentdata()]).then(() => {
                this.actionSetSystemTime();
                const isContact = !this.agentUserLevels.bank && !this.agentUserLevels.virtual_bank && !this.agentUserLevels.bind_user;
                if (isContact) {
                    alert(this.$t('S_MISTAKE_CONTACT_CUSTOM_SERVICE'));
                    return;
                }

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

                    this.$router.push({ path: `${this.url}` });
                    if (this.$route.query.type === 'mailbox') {
                        window.location.reload();
                    }
                });
            });
        }
    }
};
</script>
