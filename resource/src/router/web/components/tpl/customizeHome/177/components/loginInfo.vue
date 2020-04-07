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
            <strong>{{ memInfo.balance.total }}</strong>
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
                        class="balance-tran-btn"
                        @click="changePage('bankBalanceTran')"
                    >
                        {{ $t('S_TRAN_BALANCE') }}
                    </span>
                </div>
            </div>
        </div>
        <div class="login-info-links clearfix">
            <div
                v-for="(itemData, itemkey, index) in mcenterItemList"
                :key="`link-item-${itemkey}`"
                :class="['link-item']"
            >
                <span
                    class="item-btn"
                    @click="changePage(itemkey)"
                >
                    {{ itemData.text[language] }}
                </span>
                <span v-if="index !== Object.keys(mcenterItemList).length - 1 && index % 3 !== 2" class="link-line">|</span>
            </div>
        </div>
        <!-- 登出 -->
        <span class="link-item logout" @click="logout()">
            {{ $text('S_LOGOUT', '登出') }}
        </span>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import i18nList from '../config/lang';

export default {
    data() {
        return {
            balanceListRight: true, // 預設list向右展開
            balanceLock: false,
            lockFun: '',
            lockSec: 0,
            balanceSwitch: false,
            mcenterItemList: {
                accountData: {
                    text: i18nList.memberLinks01
                },
                deposit: {
                    text: i18nList.memberLinks02
                },
                withdraw: {
                    text: i18nList.memberLinks03
                },
                bankBalanceTran: {
                    text: i18nList.memberLinks04
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        clearTimeout(this.lockFun);
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        /* 加號展開顯示 (含計算位置) */
        balanceShow(firstPosition = false) {
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

            if (!firstPosition) {
                this.balanceSwitch = true;
            }

            // lock 為true (15秒內)
            if (this.balanceLock) {
                return;
            }
            this.balanceLock = true;
            this.actionSetUserBalance(this.lockTiming());
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
                this.$depositLink(false);
                return;
            }
            this.actionChangePage({ page: 'mcenter', type: '', subPage: item });
        },
        /* 監聽裝置 */
        handleResize() {
            this.balanceShow(true);
        },
        ...mapActions([
            'actionSetUserBalance',
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" src="../css/loginInfo.scss" scoped />
