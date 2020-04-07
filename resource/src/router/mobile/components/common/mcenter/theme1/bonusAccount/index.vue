<template>
    <div :class="$style[`theme-${siteConfig.MOBILE_WEB_TPL}`]">
        <bonus-account>
            <template scope="{ total, bonusData }">
                <mcenter-header :header-setting="headerSetting" />
                <div :class="$style['total-sub-wrap']">
                    <div :class="$style['top-sub-title']">
                        <div :class="$style['sub-title']">{{ $text('S_BONUS_CUMULATIVE_TOTAL', '累积红利总计') }}</div>
                        <div :class="$style['sub-amount']">{{ total.amount }}</div>
                    </div>
                    <div :class="$style['top-sub-title']">
                        <div :class="$style['sub-title']">{{ $text('S_BONUS_NOT_CASHED_TOTAL', '未兑现红利总计') }}</div>
                        <div :class="$style['sub-amount']">{{ total.balance }}</div>
                    </div>
                </div>
                <div :class="$style['bonus-detail-wrap']">
                    <table>
                        <thead>
                            <tr>
                                <th :class="$style['name']">{{ $text('S_PLATFORM', '平台') }}</th>
                                <th :class="$style['amount']">{{ $text('S_BONUS_CUMULATIVE', '累积红利') }}</th>
                                <th :class="$style['total']">{{ $text('S_SERIAL_NUMBER', '流水要求') }}</th>
                                <th :class="$style['aggregation']">{{ $text('S_SERIAL_NUMBER_CUMULATIVE', '累积流水') }}</th>
                                <th :class="$style['balance']">{{ $text('S_PLATFORM_BALANCE', '平台锁定余额') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, key) in bonusData"
                                :key="`bonusData-${key}`"
                            >
                                <td>{{ item.name }}</td>
                                <td>{{ item.amount }}</td>
                                <td>{{ item.total }}</td>
                                <td>{{ item.aggregation }}</td>
                                <td>{{ item.balance }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="bonusData.length === 0" :class="$style['no-data']">
                        <img :src="$getCdnPath('/static/image/mobile/mcenter/ic_nodata.png')" />
                        <p>{{ $text('S_NO_DATA_GENERATED', '尚未产生数据') }}</p>
                    </div>
                </div>
            </template>
        </bonus-account>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import bonusAccount from '@/components/common/mcenter/bonusAccount';

export default {
    components: {
        mcenterHeader: () => import(/* webpackChunkName: 'recordDeposit' */'@/router/mobile/components/common/mcenter/theme1/header'),
        bonusAccount
    },
    data() {
        return {
            headerSetting: {
                title: this.$text('S_BONUS_ACCOUNT', '红利帐户'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                },
                balance: true
            }
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
