<template>
    <div :class="[$style['content-wrap'], colorClass]">
        <mcenter-header :header-setting="headerSetting" />
        <balance-tran :class="$style['balance-tran']">
            <template
                scope="{
                    balanceTran,
                    enableAutotransfer,
                    closeAutotransfer,
                    getBalanceAll,
                    balanceBack,
                    setTranOut,
                    setTranIn,
                    setMoney,
                    balanceTransfer
                }"
            >
                <!-- 手動轉換/自動轉換 -->
                <div :class="$style['transfer-type']">
                    <!-- 自動轉換 -->
                    <div :class="[$style['transfer-btn'], balanceTran.isAutotransfer ? $style['active'] : '' ]" @click="enableAutotransfer()">
                        {{ $text("S_AUTO_TRANSFER") }}
                        <!-- 資訊按鈕 -->
                        <div :class="$style['info-icon']" @click="onTransferInfoClick(balanceTran)">
                            <icon
                                name="exclamation"
                                width="10"
                                height="10"
                            />
                        </div>
                    </div>
                    <!-- 手動轉換 -->
                    <div :class="[$style['transfer-btn'], balanceTran.isAutotransfer ? '' : $style['active']]" @click="closeAutotransfer();transferInfoActive = false;">
                        {{ $text("S_MANUAL_TRANSFER") }}
                    </div>
                    <!-- 自動轉換提示框 -->
                    <div v-if="transferInfoActive" :class="$style['auto-transfer-info']">
                        {{ $text('S_AUTOSWTICH_HINT') }}
                    </div>
                </div>
                <template>
                    <!-- 總錢包餘額區塊 -->
                    <div :class="$style['balance-total']">
                        <div :class="$style['info']">
                            <!-- 總錢包餘額文字 -->
                            <div :class="$style['text']">
                                {{ $text('S_TOTAL_WALLET_BALNCE') }}
                            </div>
                            <!-- 總錢包餘額金錢 -->
                            <div :class="[$style['text'], $style['membalance']]">{{ balanceTran.memInfo.cash.currency }} {{ balanceTran.membalance.total | commaFormat }}</div>
                        </div>
                        <div :class="$style['btn-wrap']">
                            <!-- 刷新按鈕 -->
                            <div
                                :class="[$style['refresh-btn'], balanceTran.balanceLock ? $style['disable'] : '']"
                                @click="getBalanceAll('lockStatus')"
                            >
                                <icon
                                    name="sync-alt"
                                    width="15"
                                    height="15"
                                />
                            </div>
                            <!-- 一鍵歸戶按鈕 -->
                            <div :class="[$style['recycle-btn'], balanceTran.balanceBackLock ? $style.disable : '']" @click.self="balanceBack({ afterSetUserBalance })">
                                {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
                            </div>
                        </div>
                    </div>

                    <div v-if="!balanceTran.isAutotransfer" :class="$style['manual-transfer']">
                        <!-- <div v-if="balanceTran.balanceBackLock" class="disabled-mask" /> -->
                        <div>
                            <!-- 選擇轉出帳戶 -->
                            <div :class="$style['transfer-target']">
                                <div :class="$style['text']">{{ $text('S_PLEASE_SELECT_TRANSFER_SOURCE_ACCOUNT') }}</div>
                                <vue-select
                                    :options="transList(balanceTran.transOut)"
                                    :value="transferSourceTarget"
                                    @update:value="val => setTrans(val, setTranOut)"
                                >
                                    <template slot="singleLabel" scope="{ option }">
                                        <div :class="$style['trans-text']">{{ option.label }}</div>
                                        <div :class="$style['trans-amount']">{{ customLabel(option.label) }}</div>
                                    </template>
                                </vue-select>
                            </div>
                            <!-- 選擇轉入帳戶 -->
                            <div :class="$style['transfer-target']">
                                <div :class="$style['text']">{{ $text('S_PLEASE_SELECT_TRANSFER_ACCOUNT') }}</div>
                                <vue-select
                                    :options="transList(balanceTran.transIn)"
                                    :value="transferTarget"
                                    @update:value="val => setTrans(val, setTranIn, false)"
                                >
                                    <template slot="singleLabel" scope="{ option }">
                                        <div :class="$style['trans-text']">{{ option.label }}</div>
                                        <div :class="$style['trans-amount']">{{ customLabel(option.label) }}</div>
                                    </template>
                                </vue-select>
                            </div>
                            <!-- 請輸入金額 -->
                            <div :class="$style['transfer-amount']">
                                <div :class="$style['text']">{{ $text('S_PLEASE_ENTER_THE_TRANSFER_AMOUNT') }}</div>
                                <input
                                    v-model="transferAmount"
                                    type="number"
                                    placeholder="0"
                                    @change="setMoney(transferAmount)"
                                />
                            </div>
                            <div :class="$style['btns']">
                                <div :class="$style['clear']" @click="onClear(false, setTranIn, setTranOut, setMoney)">{{ $text('S_FORM_CLEAR') }}</div>
                                <div :class="[$style['transfer'], balanceTran.transferBalanceLock ? $style.disable : '']" @click="balanceTransfer({customSucessAlert: showTransferSucess})">{{ $text('S_CONFIRM_TRANS', '确认转帐') }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 主帳戶餘額 -->
                    <div :class="$style['main-account-balance-wrap']">
                        {{ balanceTran.membalance.vendor.default.text }}
                        <span :class="$style['main-account-balance']">
                            <!-- 餘額 -->
                            <span :class="$style['amount']">
                                {{ balanceTran.membalance.vendor.default.amount | commaFormat }}
                            </span>
                        </span>
                    </div>
                    <!-- 餘額列表 -->
                    <div :class="$style['vendor-list']">
                        <div v-for="(vendor, key) in balanceTran.balanceInfo" :key="key">
                            <div :class="[$style['vendor'], 'clearfix']">
                                <!-- vendor名稱 -->
                                <span :class="$style['vendor-alias']">
                                    <img
                                        v-if="key === balanceTran.recentlyData.vendor && balanceTran.isAutotransfer"
                                        :class="$style['star-icon']"
                                        :src="$getCdnPath('/static/image/mobile/mcenter/star_icon.png')"
                                    />
                                    {{ vendor.text }}
                                </span>
                                <span v-if="!vendor.maintain" :class="$style['vendor-balance']">
                                    <!-- 餘額 -->
                                    <span :class="$style['amount']">{{ vendor.amount | commaFormat }}</span>
                                </span>
                                <!-- 維護中區塊 -->
                                <span v-if="vendor.maintain" :class="[$style['maintain'], $style.tooltip]">
                                    <!-- 維護中文字 -->
                                    <span :class="$style['text']">{{ $t("S_MAINTAIN") }}</span>
                                    <!-- 維護資訊按鈕 -->
                                    <div :class="$style['info-icon']" @click="onMaintainInfoClick(key)">
                                        <icon
                                            name="exclamation"
                                            width="10"
                                            height="10"
                                        />
                                    </div>
                                </span>
                            </div>
                            <!-- 維護資訊框 -->
                            <div v-if="maintainInfoActive[key] === true" :class="$style['maintain-info']">
                                {{ $text('S_DURING_MAINTENANCE') }}<br />
                                {{ vendor.maintain.etc_start_at }}~{{ vendor.maintain.etc_end_at }}
                            </div>
                        </div>
                        <!-- 最近一次流向平台提示 -->
                        <div v-if="balanceTran.recentlyData.vendor && balanceTran.recentlyData.vendor != '--' && balanceTran.isAutotransfer" :class="$style['last-vendor-tip']">
                            <img :class="$style['star-icon']" :src="$getCdnPath('/static/image/mobile/mcenter/star_icon.png')" />
                            {{ $text('S_LAST_PLATFORM_TIPS') }}
                        </div>
                    </div>
                </template>

                <!-- 轉帳成功彈框 -->
                <div
                    v-if="isTransferSucessShow"
                    :class="$style['transfer-sucess-wrap']"
                    @click="isTransferSucessShow = false"
                >
                    <div :class="$style['content']">
                        <img :class="$style['img']" :src="$getCdnPath('/static/image/mobile/mcenter/ic_ok.png')" />
                        <div :class="$style['text']">{{ $text('S_SUCCESSFUL_TRANSFER') }}</div>
                    </div>
                </div>
            </template>
        </balance-tran>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import vueSelect from '@/components/vueSelect';
import balanceTran from '@/components/mcenter/components/balanceTran';
import mcenterHeader from '@/router/mobile/components/common/mcenter/theme1/header';

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
    components: {
        balanceTran,
        mcenterHeader,
        vueSelect
    },
    data() {
        return {
            isTransferSucessShow: false,
            transferAmount: '',
            transferTarget: '',
            transferSourceTarget: '',
            transferInfoActive: false,
            maintainInfoActive: {},
            headerSetting: {
                title: this.$text('S_TRAN_BALANCE', '额度转换'),
                leftBtns: {
                    icon: 'arrow'
                },
                balance: true
            }
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            membalance: 'getMemBalance',
            memInfo: 'getMemInfo'
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    methods: {
        /**
         * 取得維護資訊icon圖檔路徑
         * @param {Object} scopeData
         */
        maintainInfoImgPath(vendor) {
            const filename = this.maintainInfoActive[vendor]
                ? 'btn_description_s'
                : 'btn_description_n';
            return this.$getCdnPath(
                `/static/image/mobile/mcenter/${filename}.png`
            );
        },
        onMaintainInfoClick(vendor) {
            // vedor為動態key值，需使用set觸發vue更新
            this.$set(
                this.maintainInfoActive,
                vendor,
                !this.maintainInfoActive[vendor]
            );
        },
        /**
         * 取得自動轉換資訊icon圖檔路徑
         * @param {Object} scopeData
         */
        getTransferInfoImgPath(scopeData) {
            let filename = 'btn_description_n';

            if (this.transferInfoActive) {
                filename = 'btn_description_s';
            }

            if (!scopeData.isAutotransfer) {
                filename = 'btn_description_d';
            }

            return this.$getCdnPath(
                `/static/image/mobile/mcenter/${filename}.png`
            );
        },
        onTransferInfoClick(scopeData) {
            if (!scopeData.isAutotransfer) {
                return;
            }
            this.transferInfoActive = !this.transferInfoActive;
        },
        /**
         * 轉換成功後清除欄位及訊息
         */
        showTransferSucess() {
            this.isTransferSucessShow = true;
            this.onClear(true);
        },
        /**
         * 清除欄位
         * @param {Boolean} isSucess
         * @param {Function} setTranIn
         * @param {Function} setTranOut
         * @param {Function} setMoney
         */
        onClear(isSucess, setTranIn, setTranOut, setMoney) {
            this.transferSourceTarget = '';
            this.transferTarget = '';
            this.transferAmount = '';
            if (isSucess) {
                return;
            }
            setTranIn('');
            setTranOut('');
            setMoney('');
        },
        /**
         * 一鍵歸戶重新讀取額度後
         */
        afterSetUserBalance() {
            this.transferSourceTarget = '';
        },
        /**
         * 取得餘額
         * @param {String} text - 帳戶名稱
         */
        customLabel(text) {
            let label = '';
            Object.keys(this.membalance.vendor).forEach((index) => {
                if (this.membalance.vendor[index].text === text) {
                    label = this.membalance.vendor[index].amount;
                }
            });
            return label;
        },
        /**
         * 設定轉入／轉出帳戶金額
         * @param {String} val - 金額
         * @param {Funciton} setTranFunction - 設定轉出／轉戶Funciton
         * @param {Boolean} isTransSource - 是否為轉出帳戶
         */
        setTrans(val, setTranFunction, isTransSource = true) {
            if (isTransSource) {
                setTranFunction(val);
                this.transferSourceTarget = val;
                return;
            }
            setTranFunction(val);
            this.transferTarget = val;
        },
        transList(transData) {
            return transData.map((elm) => (
                { value: elm.value, label: elm.text }
            ));
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
