<template>
    <div class="login-info-wrap clearfix">
        <!-- 帳號 -->
        <div class="login-info-item account">
            <span>{{ memInfo.user.show_alias ? $t('S_NICKNAME') : $t('S_ACCOUNT') }}：</span>
            <strong>{{ memInfo.user.show_alias ? memInfo.user.alias : memInfo.user.username }}</strong>
        </div>
        <!-- 總餘額 -->
        <div class="login-info-item balance">
            <span>{{ $t('S_TOTAL_BALANCE') }}：</span>
            <strong>{{ memInfo.balance.total }} {{ memInfo.cash.currency }}</strong>
        </div>
        <!-- 額度加號 -->
        <div
            ref="balanceIcon"
            class="balance-wrap"
            @mouseover="balanceShow()"
            @mouseleave="balanceSwitch = false"
        >
            <!-- 額度icon -->
            <icon
                class="balance-icon"
                width="14"
                name="plus-square"
            />
            <!-- 額度list (滑入加號展開) -->
            <div
                ref="balanceList"
                :class="[
                    'balance-list-wrap',
                    balanceSwitch ? 'show' : '' ,
                    balanceListRight ? 'right' : ''
                ]"
            >
                <!-- 各項目額度 -->
                <transition-group key="balance-list-animate" :name="animateName">
                    <div v-if="balanceSwitch" key="balance-list-animate">
                        <div class="balance-list">
                            <div
                                v-for="(item, key) in memInfo.balance.vendor"
                                :key="key"
                                class="balance-item clearfix"
                            >
                                <span class="balance-text">{{ item.text }}：</span>
                                <span class="balance-money">
                                    <template v-if="item.maintain">
                                        <font color="red">{{ $t('S_MAINTAIN') }}</font>
                                    </template>
                                    <template v-else>
                                        {{ item.amount }}
                                    </template>
                                </span>
                            </div>
                        </div>
                        <!-- 額度轉換 -->
                        <div class="balance-tran clearfix">
                            <span
                                :title="$t('S_TRAN_BALANCE')"
                                class="balance-tran-btn"
                                @click="getMcenterPage('bankBalanceTran')"
                            >
                                {{ $t('S_TRAN_BALANCE') }}
                            </span>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
        <div class="login-info-links clearfix">
            <!-- 會員中心 -->
            <template v-for="(itemData, itemKey) in mcenterItemList">
                <span
                    :key="`link-item-${itemKey}`"
                    class="link-item mcenter"
                    @click="getMcenterPage(itemKey)"
                >
                    {{ $t(itemData.text) }}
                </span>
                <span
                    v-if="itemData.hasLine"
                    :key="`link-item-${itemKey}`"
                    class="link-line"
                >|
                </span>
            </template>
            <!-- 登出 -->
            <span class="link-item logout" @click="logout()">
                {{ logoutText ? logoutText : $t('S_LOGOUT') }}
            </span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';

export default {
    props: {
        logoutText: {
            type: String,
            default: ''
        },
        animateName: {
            type: String,
            default: 'fade'
        },
        mcenterItemList: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            balanceListRight: true, // 預設list向右展開
            balanceLock: false,
            lockFun: '',
            lockSec: 0,
            balanceSwitch: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    destroyed() {
        clearTimeout(this.lockFun);
    },
    methods: {
        /* 加號展開顯示 (含計算位置) */
        balanceShow() {
            if (this.balanceSwitch) {
                return;
            }

            this.balanceListRight = true; // 預設 list 向右展開
            const bodyWidth = document.body.clientWidth; // 螢幕寬
            const listWidth = this.$refs.balanceList.offsetWidth; // 額度 list 寬度
            const iconWidth = this.$refs.balanceIcon.offsetWidth; // 額度 icon 寬度
            const iconLeft = this.$refs.balanceIcon.offsetLeft; // 額度 icon left位置

            // 計算 list 向右展開無法完整顯示, 改向左
            if (bodyWidth - (iconLeft + iconWidth + listWidth) < 0) {
                this.balanceListRight = false;
            }

            this.balanceSwitch = true;

            // lock 為true (15秒內)
            if (this.balanceLock) {
                return;
            }
            this.balanceLock = true;
            this.actionSetUserBalance().then(() => {
                this.lockTiming();
            });
        },
        /* 阻擋 15秒內 重複取 balance */
        lockTiming() {
            if (this.lockSec === 15) {
                clearTimeout(this.lockFun);
                this.lockSec = 0;
                this.balanceLock = false;
                return;
            }
            this.lockSec += 1;
            this.lockFun = setTimeout(() => {
                this.lockTiming();
            }, 1000);
        },
        /* 會員登出 */
        logout() {
            member.logout({
                success: () => {
                    window.location.reload();
                }
            });
        },
        changePage(item) {
            if (item === 'deposit') {
                this.$depositLink();
                return;
            }

            this.actionChangePage({ page: 'mcenter', type: '', subPage: item });
        },
        getMcenterPage(page, firstEnter = false) {
            this.navClicked = true;
            if (page === 'bankRebate') {
                this.actionEnterMCenterThirdPartyLink({ type: 'member', page }).then((pageName) => {
                    if (pageName) {
                        mcenterPageAuthControl(pageName).then((response) => {
                            if (response && response.status) {
                                this.$router.push({ path: `/page/mcenter/${pageName}` });
                                return;
                            }

                            if (firstEnter) {
                                this.$router.push({ path: '/page/mcenter/accountData' });
                            }
                        });
                    }
                });
                return;
            }

            if (page === 'deposit') {
                this.$depositLink(false);
                return;
            }

            mcenterPageAuthControl(page).then((response) => {
                if (response && response.status) {
                    this.$router.push({ path: `/page/mcenter/${page}` });
                    return;
                }

                if (firstEnter) {
                    this.$router.push({ path: '/page/mcenter/accountData' });
                }
            });
        },
        ...mapActions([
            'actionSetUserBalance',
            'actionChangePage'
        ])
    }
};
</script>
