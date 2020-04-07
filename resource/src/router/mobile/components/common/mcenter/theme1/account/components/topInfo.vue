<template>
    <div class="content-top clearfix">
        <div class="content-top-left">
            <div class="content-top-title">
                <!-- eslint-disable vue/no-v-html -->
                <span v-html="contentTitle" />
                <!-- eslint-enable vue/no-v-html -->
                <span v-if="memInfo.user.bankrupt === '1'" class="prompt">
                    <icon
                        name="exclamation-circle"
                        width="20"
                        height="20"
                        class="warning"
                    />
                    <span>{{ $t('S_BANKRUPT_PROMPT') }}</span>
                </span>
            </div>
            <div v-if="vipData.enable" class="content-top-title vip">
                {{ $t('S_VIP_LEVEL') }}：
                {{ vipData.now_level_alias }}，
                <div class="vip-wrap">
                    <div
                        class="vip-text"
                        @click="switchVIP('setPop')"
                        @mouseover="switchVIP(true)"
                        @mouseleave="switchVIP(false)"
                    >
                        {{ $t('S_NEXT_LEVEL') }}
                        <icon
                            name="exclamation-circle"
                            width="13"
                            height="13"
                        />
                    </div>
                    <transition :name="'fade'">
                        <div
                            v-if="vipSwitch"
                            :class="[
                                'vip-item-wrap',
                            ]"
                        >
                            <div class="vip-title">
                                {{ $t('S_CURRENT_LEVEL') }}：
                                <span>{{ vipData.now_level_alias }}</span>
                            </div>
                            <!-- eslint-disable vue/no-v-html -->
                            <div class="vip-content" v-html="vipText" />
                            <!-- eslint-enable vue/no-v-html -->
                        </div>
                    </transition>
                </div>
            </div>
            <div class="content-top-title">
                <span>{{ $t('S_CURRENCY') }}：{{ memInfo.cash.currency }}</span>
            </div>
            <div class="content-top-title">
                <span>{{ $t('S_TIME_OF_EAST_US') }}：{{ estTimeNow }}</span>
            </div>
            <div class="pad-show-percent">({{ $t('S_SAFETY_DEGREE') }}：{{ percentNum }}%)</div>
            <div class="content-top-info">
                <div>
                    <!-- eslint-disable vue/no-v-html -->
                    <span ref="message-text" v-html="messageText" />
                    <!-- eslint-enable vue/no-v-html -->
                </div>
                <div class="info-item">
                    <label>{{ $t('S_LAST_LOGIN_IP') }}：</label>
                    <span>{{ memInfo.user.last_ip || '--' }}</span>
                </div>
                <div class="info-item">
                    <label>{{ $t('S_LAST_LOGON_TIME') }}：</label>
                    <span>{{ memInfo.user.last_login }}</span>
                </div>
            </div>
        </div>
        <div v-show="!isMobileWeb" class="content-top-percent">
            <svg width="122" height="122">
                <circle
                    cx="60"
                    cy="60"
                    r="57"
                    fill="transparent"
                    stroke="#D4D4D4"
                    stroke-width="2"
                />
                <circle
                    id="js-sec-circle"
                    class="percent-circle"
                    cx="60"
                    cy="60"
                    r="57"
                    stroke-width="6"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div class="percent-num">
                <span class="number">{{ percentNum }}</span>
                <span class="unit">%</span>
            </div>
            <div class="percent-text">{{ $t('S_SAFETY_DEGREE') }}</div>
        </div>
    </div>
</template>

<script>
/* global $ */
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import EST from '@/lib/EST';
import mcenter from '@/api/mcenter';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';

export default {
    props: {
        isMobileWeb: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            estTimer: '',
            listSwitch: false,
            titleCurrent: 'account',
            bankCardBind: false,
            percentNum: 0,
            percentAll: 0,
            estTimeNow: '',
            vipData: {},
            vipSwitch: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            systemTime: 'getSystemTime'
        }),
        contentTitle() {
            const contentTitle = this.$t('S_WELCOME_DEAR');
            const result = contentTitle.replace('%s', `<span class="account"> ${this.memInfo.user.username}</span>`);
            return result;
        },
        messageText() {
            return this.$text('S_UNREAD_MESSAGE', {
                text: '您有%S條資訊未閱讀',
                replace: [
                    {
                        target: '%S',
                        value: `<span class="message">${this.memInfo.msgCount}</span>`
                    }
                ]
            });
        },
        vipText() {
            let vipText;
            if (!this.vipData.is_lock) {
                if (this.vipData.is_max_level) {
                    vipText = this.$t('S_VIP_MAX_LEVEL');
                } else if (this.vipData.is_achieve) {
                    vipText = this.$text('S_VIP_ACHIEVE', {
                        replace: [{ target: '%s', value: `<span>${this.vipData.next_level_alias}</span>` }]
                    });
                } else {
                    vipText = this.$text('S_LEVEL_UPGRADE_PROMPT', {
                        replace: [
                            { target: '%S', value: `<span>${this.formatToPrice(this.vipData.upgrade_valid_bet)}</span>` },
                            { target: '%S', value: `<span>${this.vipData.upgrade_deposit_times}</span>` },
                            { target: '%S', value: `<span>${this.formatToPrice(this.vipData.upgrade_deposit_amount)}</span>` },
                            { target: '%s', value: `<span>${this.vipData.next_level_alias}</span>` }
                        ]
                    });
                }
            }

            return vipText;
        }
    },
    watch: {
        systemTime() {
            this.estClock();
        },
        percentNum() {
            if (!$('.percent-circle')) {
                return;
            }
            this.percentAll = +$('.percent-circle').css('stroke-dasharray').replace('px', '');
            $('.percent-circle').css('stroke-dashoffset', Math.round((this.percentAll * (100 - this.percentNum)) / 100));
        }
    },
    created() {
        this.actionSetSystemTime();
        this.estClock();
        this.getPercent();
        this.actionSetMcenterMsgCount();

        // 30秒更新一次未讀訊息
        window.setInterval(() => {
            this.actionSetMcenterMsgCount();
        }, 30000);

        mcenter.accountVIP({
            success: (response) => {
                this.vipData = {
                    type: 'vip',
                    key: 'text',
                    position: 'mcenter',
                    btnText: this.$t('S_VIP_LEVEL'),
                    ...response.ret
                };
            }
        });
    },
    mounted() {
        $(this.$refs['message-text']).on('click', 'span', this.navChangePage);
    },
    beforeDestroy() {
        $(this.$refs['message-text']).off('click', 'span', this.navChangePage);
    },
    methods: {
        ...mapActions([
            'actionSetMcenterMsgCount',
            'actionSetPop',
            'actionSetSystemTime'
        ]),
        // 帳戶安全程度
        getPercent() {
            mcenter.percent({
                success: (response) => {
                    this.percentNum = response.ret.percentage;
                }
            });
        },
        estClock() {
            clearInterval(this.estTimer);
            this.estTimeNow = EST(this.systemTime);
            this.estTimer = setInterval(() => {
                this.estTimeNow = Vue.moment(this.estTimeNow).add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
            }, 1000);
        },
        listSelect() {
            this.listSwitch = !this.listSwitch;
            window.scrollTo(0, 0);
        },
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        },
        navChangePage() {
            mcenterPageAuthControl().then((response) => {
                if (response && response.status) {
                    if (this.$route.path.split('/')[1] === 'mobile') {
                        this.$router.push({ path: '/page/mcenter/message' });
                        return;
                    }

                    this.$router.push({ path: '/page/mcenter/infoMessage' });
                }
            });
        },
        switchVIP(val) {
            if (this.isMobileWeb) {
                if (val === 'setPop') {
                    this.actionSetPop({
                        type: 'account',
                        data: this.vipData
                    });
                }

                return;
            }

            this.vipSwitch = val;
        }
    }
};
</script>

<style lang="scss" src="../../css/common/topInfo/index.scss" scoped></style>
