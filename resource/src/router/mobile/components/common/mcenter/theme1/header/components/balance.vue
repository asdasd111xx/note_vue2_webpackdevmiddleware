<template>
    <div
        :class="[$style['balance-wrap'], colorClass]"
        @click.self="$emit('update:openState', '')">
        <div :class="$style.balance">
            <!-- header 區塊 -->
            <div :class="$style.header">
                <!-- 關閉按鈕 -->
                <div
                    :class="$style['close-icon']"
                    @click="$emit('update:openState', '')"
                >
                    <icon
                        name="times"
                        height="20"
                        width="20"
                    />
                </div>
                <!-- 錢包停權 -->
                <div v-if="memInfo.user.bankrupt === '1'" :class="[$style['text'], $style['bankrupt']]">
                    <img :class="$style['alert-icon']" :src="$getCdnPath('/static/image/mobile/mcenter/ic_alert1.png')" />
                    {{ $text('S_BANKRUPT_PROMPT') }}
                </div>
                <div :class="$style['main-account-block']">
                    <!-- 主帳戶餘額 -->
                    <div :class="[$style['main-account-text'], $style['text']]">
                        {{ mainAccount.text }}
                    </div>
                    <!-- 餘額金額 -->
                    <div :class="$style['text']">
                        {{ mainAccount.amount | commaFormat }}
                    </div>
                    <!-- 刷新按鈕 -->
                    <div
                        :class="[$style['refresh-btn'], getMemberBalanceLock ? $style['disable'] : '']"
                        @click="getMemberBalance()"
                    >
                        <icon
                            name="sync-alt"
                            width="15"
                            height="15"
                        />
                    </div>
                </div>
            </div>
            <!-- content 區塊 -->
            <div :class="[$style.content, memInfo.user.bankrupt === '1' ? $style.bankrupt : '']">
                <div
                    v-for="(vendor, key) in vendorList"
                    :key="key"
                    :class="$style['balance-item']"
                >
                    <!-- 平台名稱 -->
                    <div :class="[$style['text'], $style['vendor-name']]">
                        <!-- 星號標示 -->
                        <img
                            v-if="key === lastVendor.vendor"
                            :class="$style['star-icon']"
                            :src="$getCdnPath('/static/image/mobile/mcenter/star_icon.png')"
                        />
                        {{ vendor.text }}
                    </div>
                    <!-- 維護中 -->
                    <div v-if="vendor.maintain" :class="[$style['text'], $style['maintain']]">
                        {{ $text('S_MAINTAIN') }}
                    </div>
                    <!-- 平台餘額 -->
                    <div v-if="!vendor.maintain" :class="[$style['text'], $style['vendor-balance']]">
                        {{ vendor.amount | commaFormat }}
                    </div>
                </div>
                <!-- 提示 -->
                <div v-if="memInfo.auto_transfer.enable && lastVendor.vendor !== '--'" :class="$style.tip">
                    <img :class="$style['star-icon']" :src="$getCdnPath('/static/image/mobile/mcenter/star_icon.png')" />
                    {{ $text('S_LAST_PLATFORM_TIPS') }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    filters: {
        /**
         * 金額格式化
         * @method commaFormat
         * @param {String} value - 金額
         * @returns {String} 格式化後的金額
         */
        commaFormat(value) {
            if (!value) {
                return '';
            }

            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    },
    props: {
        openState: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            lastVendor: {},
            getMemberBalanceLock: false,
            // 餘額刷新timer instance,15秒才能操作一次餘額刷新
            timer: null,
            // 餘額刷新已鎖定的秒數,15秒才能操作一次餘額刷新
            lockSec: 0
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            memBalance: 'getMemBalance'
        }),
        mainAccount() {
            return this.memBalance.vendor.default || {};
        },
        vendorList() {
            const list = { ...this.memBalance.vendor };
            delete list.default;
            return list;
        },
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    created() {
        mcenter.lastVendor({
            success: (response) => {
                this.lastVendor = response.ret;
            }
        });
    },
    methods: {
        ...mapActions([
            'actionSetUserBalance'
        ]),
        /**
         * 餘額刷新並設置timer,15秒才能操作一次餘額刷新
         */
        getMemberBalance() {
            if (this.getMemberBalanceLock) {
                return Promise.resolve({});
            }
            this.getMemberBalanceLock = true;
            return this.actionSetUserBalance()
                .then(() => {
                    this.timer = setInterval(this.checkBalanceLock, 1000);
                })
                .catch((err) => {
                    this.timer = setInterval(this.checkBalanceLock, 1000);
                    throw err;
                });
        },
        /**
         * 檢查餘額的timer,15秒才能操作一次餘額刷新
         */
        checkBalanceLock() {
            if (this.lockSec >= 15) {
                this.clearBlanceTimer();
                this.getMemberBalanceLock = false;
                return;
            }
            this.lockSec += 1;
        },
        clearBlanceTimer() {
            clearInterval(this.timer);
            this.lockSec = 0;
        }
    }
};
</script>
<style lang="scss" src="./css/index.module.scss" module />
