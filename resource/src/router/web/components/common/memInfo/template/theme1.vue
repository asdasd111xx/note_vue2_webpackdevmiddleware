<template>
    <div>
        <!-- 帳號 -->
        <div class="mem-info-item account">
            <span>{{ memInfo.user.show_alias ? $t('S_NICKNAME') : $t('S_ACCOUNT') }}：</span>
            <strong>{{ memInfo.user.show_alias ? memInfo.user.alias : memInfo.user.username }}</strong>
        </div>
        <!-- 總餘額 -->
        <div class="mem-info-item balance">
            <span>{{ $t('S_TOTAL_BALANCE') }}：</span>
            <strong>{{ memInfo.balance.total }}{{ memInfo.cash.currency }}</strong>
        </div>
        <!-- 額度 -->
        <div
            ref="balanceIcon"
            class="balance-wrap"
            @mouseover="balanceShow()"
            @mouseleave="balanceSwitch = false"
        >
            <icon
                class="balance-icon"
                name="plus-square"
                width="14"
            />
            <!-- 額度list -->
            <div
                ref="balanceList"
                :class="[
                    'balance-list-wrap',
                    balanceListDirection,
                    { 'is-show': balanceSwitch }
                ]"
            >
                <transition :name="listStyle.animateName">
                    <div v-if="balanceSwitch">
                        <!-- 各項目額度 -->
                        <div class="balance-list">
                            <div
                                v-for="(item, key) in memInfo.balance.vendor"
                                :key="key"
                                class="balance-item clearfix"
                            >
                                <span class="balance-text">{{ item.text }}：</span>
                                <span :class="['balance-money', { 'is-maintain': item.maintain }]">
                                    {{ item.maintain ? $t('S_MAINTAIN') : item.amount }}
                                </span>
                            </div>
                        </div>
                        <!-- 額度轉換 -->
                        <div class="balance-list-bottom clearfix">
                            <div
                                :title="$t('S_TRAN_BALANCE')"
                                class="balance-translate"
                                @click="onBalanceTrans()"
                            >
                                {{ $t('S_TRAN_BALANCE') }}
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: {
        listStyle: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            balanceListDirection: 'right', // 預設list向右展開
            balanceCache: false,
            balanceSwitch: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        ...mapActions([
            'actionSetUserBalance',
            'actionChangePage'
        ]),
        /* 加號展開顯示 */
        balanceShow(isShow = false) {
            if (this.balanceSwitch) {
                return;
            }

            this.balanceListDirection = 'right';
            const bodyWidth = document.body.clientWidth; // 螢幕寬
            const listWidth = this.$refs.balanceList.offsetWidth; // 額度 list 寬度
            const iconWidth = this.$refs.balanceIcon.offsetWidth; // 額度 icon 寬度
            const iconLeft = this.$refs.balanceIcon.offsetLeft; // 額度 icon left位置

            // 計算 list 向右展或向左展
            this.balanceListDirection = (bodyWidth - (iconLeft + iconWidth + listWidth) >= 0) ? 'right' : 'left';

            if (!isShow) {
                this.balanceSwitch = true;
            }

            if (this.balanceCache) {
                return;
            }

            this.balanceCache = true;
            this.actionSetUserBalance().then(() => {
                /* 阻擋 15秒內 重複取 balance */
                setTimeout(() => {
                    this.balanceCache = false;
                }, 15000);
            });
        },
        onBalanceTrans() {
            this.actionChangePage({ page: 'mcenter', type: '', subPage: 'bankBalanceTran' });
        },
        /* 監聽裝置 */
        handleResize() {
            this.balanceShow(true);
        }
    }
};
</script>

<style lang="scss" src="../css/theme1.scss" scoped></style>
