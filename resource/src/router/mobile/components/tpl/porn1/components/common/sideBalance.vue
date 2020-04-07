<template>
    <div :class="[$style.balance, $style[`is-${$route.name.split('-')[0]}`]]">
        <div :class="$style.content">
            <!-- 關閉按鈕 -->
            <div :class="$style.close" @click="$emit('update:openState', '')" />
            <!-- 錢包停權 -->
            <span v-if="memInfo.user.bankrupt === '1'" :class="$style['prompt']">
                <img :class="$style['warning']" :src="$getCdnPath('/static/image/mobile/tpl/porn1/home/ic_alert.png')" />
                <span>{{ $t('S_BANKRUPT_PROMPT') }}</span>
            </span>
            <!-- 上方餘額資訊 -->
            <div :class="[$style.top, 'clearfix']">
                <template v-if="!updating">
                    <div :class="$style['total-title']">{{ $text('S_TOTAL_MONEY') }}</div>
                    <div :class="$style['total-amount']">{{ memBalance.total | commaFormat }} {{ memCurrency }}</div>
                </template>
            </div>
            <template v-if="!updating">
                <!-- 中間功能按鈕 -->
                <div :class="[$style.button, 'clearfix']">
                    <!-- 額度轉換 -->
                    <div :class="$style.trans" @click="toBalance">{{ $text('S_TRANSDER') }}</div>
                    <!-- 線上存款 -->
                    <div :class="$style.deposite" @click="toDeposit">{{ $text('S_DEPOSIT') }}</div>
                </div>
                <!-- 更新餘額 -->
                <div :class="$style.update" @click="onUpdate"><i :class="$style.sync" />{{ $text('S_UPDATE_ALL_BALANCE') }}</div>
                <!-- 各平台餘額 -->
                <div :class="$style.wrap">
                    <template v-for="(vendor, key) in memBalance.vendor">
                        <div :key="key" :class="[$style.vendor, 'clearfix']">
                            <div v-if="memInfo.auto_transfer.enable && key === memInfo.auto_transfer.vendor" :class="$style.star" />
                            <div :class="$style.title">{{ vendor.text }}</div>
                            <div v-if="vendor.maintain" :class="$style.maintain">{{ $text('S_MAINTAIN') }}</div>
                            <div v-else :class="$style.amount">{{ vendor.amount }}</div>
                        </div>
                    </template>
                    <!-- 餘額提示 -->
                    <div v-if="memInfo.auto_transfer.enable" :class="[$style.tips, 'clearfix']">{{ $text('S_LAST_PLATFORM_TIPS') }}</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    filters: {
        /**
         * 金額格式化
         * @method commaFormat
         * @param {String} value - 金額
         * @returns {String} 格式化後的金額
         */
        commaFormat(value) {
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
            updating: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            memCurrency: 'getMemCurrency',
            memBalance: 'getMemBalance'
        })
    },
    methods: {
        ...mapActions([
            'actionSetUserBalance'
        ]),
        /**
         * 前往額度轉換頁
         * @method toBalance
         */
        toBalance() {
            this.$emit('update:openState', '');
            this.$router.push('/mobile/mcenter/balanceTrans');
        },
        /**
         * 前往線上存款頁
         * @method toDeposit
         */
        toDeposit() {
            this.$depositLink(true);
        },
        /**
         * 更新餘額
         * @method onUpdate
         */
        onUpdate() {
            this.updating = true;
            this.actionSetUserBalance().then(() => {
                this.updating = false;
            });
        }
    }
};
</script>

<style lang="scss" module>
.balance {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #FFF;
}

.content {
    position: relative;
    width: 77%;
    height: 100%;
    margin-left: auto;
    background-color: #222;
}

.close {
    position: absolute;
    top: 13px;
    right: 13px;
    z-index: 1;
    width: 20px;
    height: 20px;
    background: url('/static/image/mobile/tpl/brilliant/common/balance/btn_close.png') 0 0 no-repeat;
    background-size: 100%;
}

.prompt {
    position: absolute;
    padding-left: 13px;
    top: 44px;
    right: 0;
    width: 100%;
    color: #FFF;
    background: #FF5454;
    text-align: left;
    font-size: 12px;
    z-index: 1;

    .warning {
        margin-top: 1px;
        width: 13px;
        height: 13px;
        vertical-align: middle;
    }

    span {
        vertical-align: middle;
    }
}

.top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    padding: 70px 13px 0;
    border-bottom: 2px solid #221817;
    background: #FFC954;
    background: linear-gradient(90deg, #FFC954, #FEE084);
    color: #000;
}

.total-title {
    float: left;
}

.total-amount {
    float: right;
}

.button {
    position: absolute;
    top: 100px;
    left: 0;
    width: 100%;
    padding: 16px 19px;
    border-bottom: 1px solid #414141;
    background-color: #000;

    > div {
        width: 45%;
        height: 35px;
        line-height: 35px;
        border: 1px solid #FFCC5A;
        border-radius: 3px;
        background-color: #000;
        color: #FFCC5A;
        text-align: center;
    }

    .trans {
        float: left;
    }

    .deposite {
        float: right;
    }
}

.update {
    position: absolute;
    top: 168px;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 43px;
    padding: 0 15px 0 18px;
    border-bottom: 1px solid #414141;
    background-color: #000;
    color: #FFF;
    font-size: 13px;
    text-align: right;
}

.sync {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 8px;
    background: url('/static/image/mobile/tpl/porn1/home/updated_icon.png') 0 0 no-repeat;
    background-size: 100%;
    vertical-align: middle;
}

.wrap {
    overflow-y: scroll;
    height: 100%;
    padding: 218px 15px 7px 18px;
    border-bottom: 1px solid #414141;
    background-color: #000;
}

.vendor {
    line-height: 30px;
    color: #FFF;
    font-size: 14px;
}

.star {
    float: left;
    width: 9px;
    height: 9px;
    margin: 10px 3px 0 0;
    background: url('/static/image/mobile/tpl/brilliant/common/balance/icon_star.png') 0 0 no-repeat;
    background-size: 100%;
}

.title {
    float: left;
}

.amount {
    float: right;
}

.maintain {
    float: right;
    color: #F94444;
    font-size: 13px;
}

.tips {
    float: right;
    height: 23px;
    line-height: 23px;
    padding-left: 15px;
    background: url('/static/image/mobile/tpl/brilliant/common/balance/icon_star.png') 0 50% no-repeat;
    background-size: 9px;
    color: #7C8B9A;
    font-size: 13px;
}

.is-mcenter {
    .top {
        border-bottom: 2px solid #26262F;
        background-color: #3D3D4A;
    }

    .button {
        border-bottom: 1px solid #222229;
        background-color: #34343F;

        > div {
            background-color: #57576A;
            color: #FFF;
        }
    }

    .update {
        background-color: #34343F;
    }

    .wrap {
        background-color: #FFF;
    }

    .vendor {
        color: #000;
    }
}
</style>
