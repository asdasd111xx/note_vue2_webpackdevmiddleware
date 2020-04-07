<template>
    <div :class="$style['top-info']">
        <div :class="$style.wrap">
            <div :class="[$style['user-info'], 'clearfix']">
                <div :class="$style['profile-photo']">
                    <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/agent/profile-photo.png')" />
                </div>
                <div :class="$style['info-wrap']">
                    <div :class="$style.username">欢迎您，尊贵的&nbsp;<span>{{ agentInfo.user.username }}</span></div>
                    <div :class="$style.currency">币别：{{ agentInfo.cash.currency }}</div>
                </div>
            </div>
            <div :class="[$style['link-info'], 'clearfix']">
                <div
                    v-for="info in links"
                    :key="info.key"
                    :class="$style['top-link']"
                    @click="onListClick(info)"
                >
                    <img :src="$getCdnPath(`/static/image/mobile/tpl/theme3/agent/${info.icon}.png`)" />
                    <span>{{ info.title }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as axios from 'axios';
import agValidate from '@/lib/agValidate';

export default {
    computed: {
        ...mapGetters({
            agentInfo: 'getAgentInfo',
            agentUserLevels: 'getAgentUserLevels'
        }),
        links() {
            return [
                {
                    key: 'financeReward',
                    title: '佣金报表',
                    icon: 'finance-reward',
                    path: '/mobile/agcenter/financeReward'
                },
                {
                    key: 'reportMember',
                    title: '会员列表',
                    icon: 'report-member',
                    path: '/mobile/agcenter/reportMember'
                },
                {
                    key: 'financeWithdraw',
                    title: '取款',
                    icon: 'finance-withdraw',
                    path: '/mobile/agcenter/financeWithdraw'
                }
            ];
        }
    },
    methods: {
        ...mapActions([
            'actionSetAgentdata',
            'actionSetPop',
            'actionSetSystemTime'
        ]),
        onListClick(info) {
            const isContact = !this.agentUserLevels.bank && !this.agentUserLevels.virtual_bank && !this.agentUserLevels.bind_user;

            if (info.key === 'financeWithdraw' && isContact) {
                alert(this.$t('S_MISTAKE_CONTACT_CUSTOM_SERVICE'));
                return;
            }

            if (info.key !== 'financeWithdraw' && info.key !== 'accountBankCard') {
                this.$router.push(info.path);
                return;
            }

            axios.all([this.actionSetAgentdata()]).then(() => {
                this.actionSetSystemTime();

                agValidate(info.key).then((res) => {
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

                    this.$router.push(info.path);
                });
            });
        }
    }
};
</script>

<style lang="scss" module>
.top-info {
    padding: 0 13px 12px;
    background-color: #272727;
}

.wrap {
    background: url('/static/image/mobile/tpl/theme3/agent/bg02.png') 0 0 no-repeat;
    background-size: 100% 100%;
}

.user-info {
    height: 53px;
    padding: 5px 17px;
    background: url('/static/image/mobile/tpl/theme3/agent/bg01.png') 0 0 no-repeat;
    background-size: 100% 100%;
}

.profile-photo {
    float: left;
    width: 43px;
    height: 43px;
    margin-right: 9px;

    > img {
        display: block;
        width: 100%;
    }
}

.info-wrap {
    float: left;
    width: calc(100% - 43px - 9px);
    height: 43px;
}

.username {
    overflow: hidden;
    line-height: 23px;
    color: #9C6E54;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;

    > span {
        color: #5C4030;
    }
}

.currency {
    line-height: 20px;
    color: #9C6E54;
    font-size: 12px;
}

.link-info {
    height: 80px;
    padding: 8px 0;
}

.top-link {
    float: left;
    width: 33.333%;

    > img {
        display: block;
        width: 45px;
        height: 45px;
        margin: 0 auto 7px;
    }

    > span {
        display: block;
        line-height: 12px;
        color: #2D477E;
        font-size: 12px;
        text-align: center;
    }
}
</style>
