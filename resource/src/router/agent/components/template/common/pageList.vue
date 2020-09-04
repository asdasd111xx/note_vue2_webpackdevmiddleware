<template>
    <div :class="$style['list-wrap']">
        <img
            v-if="webInfo.logo"
            :src="`${API_CDN}${webInfo.logo}`"
            :class="$style['logo']"
            width="96"
            height="38"
        />
        <div :class="$style['agcenter-list']">
            <div
                v-for="title in list"
                :key="title.key"
                :class="$style['list-category']"
            >
                <div :class="title.key == currentTag.title.key ? $style['list-title-current'] : $style['list-title']" :title="$t(title.text)">{{ $t(title.text) }}</div>
                <div
                    v-for="item in title.item"
                    :key="item.key"
                    :title="$t(item.text)"
                    :class="[item.key == currentTag.item.key ? $style['list-item-current'] : $style['list-item'], $style[`list-item-${item.key}`], item.key]"
                    @click="changePage(item.key)"
                >
                    {{ $t(item.text) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as axios from 'axios';
import { API_CDN } from '@/config/api';
import agValidate from '@/lib/agValidate';

export default {
    props: {
        theme: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            API_CDN
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            agentInfo: 'getAgentInfo',
            agcenterList: 'getAgcenterList',
            agentUserLevels: 'getAgentUserLevels'
        }),
        $style() {
            if (this.theme) {
                return this.theme;
            }

            return this.$styleDefault;
        },
        list() {
            return this.agcenterList.filter((info) => {
                const { config, user } = this.agentInfo;
                // 我的推廣關閉時，不顯示會員遊戲紀錄
                if (info.key === 'report') {
                    return user.show_promotion;
                }

                if (info.key !== 'mobile') {
                    return true;
                }

                return config.app_is_ready;
            });
        },
        currentPage() {
            return this.$route.path.split('/')[2];
        },
        currentTag() {
            const result = {};
            Object.keys(this.list).forEach((index) => {
                Object.keys(this.list[index].item).forEach((idx) => {
                    if (this.list[index].item[idx].key === this.currentPage) {
                        result.title = {
                            key: this.list[index].key,
                            text: this.$t(this.list[index].text)
                        };

                        result.item = {
                            key: this.currentPage,
                            text: this.$t(this.list[index].item[idx].text)
                        };
                    }
                });
            });

            return result;
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionSetAgentdata'
        ]),
        listSelect() {
            window.scrollTo(0, 0);
        },
        changePage(pageName) {
            if (pageName === 'downloadApp') {
                window.open('/mobileBet', 'mobileBet');
                return;
            }

            axios.all([this.actionSetAgentdata()]).then(() => {
                // 代理強制修改密碼機制
                if (this.agentInfo.user.password_reset) {
                    return;
                }

                if (!['accountBankCard', 'financeWithdraw'].includes(pageName)) {
                    this.$router.push(`/agent/${pageName}`);
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
                    if (pageName === 'accountBankCard') {
                        alert(this.$text('S_MISTAKE_BANKCARD_CUSTOM_SERVICE'));
                        return;
                    }
                }

                agValidate(pageName).then((res) => {
                    // 帳號為停權狀態
                    if (res.message === 'isBankrupt') {
                        alert(this.$i18n.t('S_BANKRUPT_TIP'));
                        return;
                    }

                    // 未設定姓名, 未設定取款密碼, 綁定銀行卡內無常用帳號
                    if (res.message === 'noName' || res.message === 'noPassword' || res.message === 'noCommonAccount' || res.message === 'mobileDidNotPass') {
                        this.actionSetPop({ type: 'note' });
                        return;
                    }

                    this.$router.push(`/agent/${pageName}`);
                });
            });
        }
    }
};
</script>

<style src="../../../css/common/pageList.module.scss" lang="scss" module="$styleDefault" />
