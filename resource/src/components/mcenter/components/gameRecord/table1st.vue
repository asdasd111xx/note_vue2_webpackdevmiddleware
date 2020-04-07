<template>
    <table :class="[$style.table, $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <thead>
            <tr>
                <th>{{ $text('S_FIRST_LEVEL_FRIEND', '一级好友') }}</th>
                <th :class="$style.sort" @click="onSort('bet')">
                    {{ $text('S_WAGER_AMOUNT', '投注金额') }} <icon name="sort" />
                </th>
                <th :class="$style.sort" @click="onSort('valid_bet')">
                    {{ $text('S_VALID_BET', '有效投注') }} <icon name="sort" />
                </th>
                <th :class="$style.sort" @click="onSort('payoff')">
                    {{ $text('S_PAY_OUT', '派彩') }} <icon name="sort" />
                </th>
                <th>{{ $text('S_OPERATE', '操作') }}</th>
            </tr>
        </thead>
        <template v-if="list.length === 0">
            <tbody>
                <tr><td :class="$style['no-data']" colspan="5">{{ $t('S_NO_DATA_YET') }}</td></tr>
            </tbody>
        </template>
        <template v-else>
            <tbody>
                <tr v-for="(info, index) in list" :key="index">
                    <td :class="$style['is-text']">{{ info.username }}</td>
                    <td :class="info.bet < 0 ? $style['is-negative'] : $style['is-number']">{{ info.bet }}</td>
                    <td :class="info.valid_bet < 0 ? $style['is-negative'] : $style['is-number']">{{ info.valid_bet }}</td>
                    <td :class="info.payoff < 0 ? $style['is-negative'] : $style['is-number']">{{ info.payoff }}</td>
                    <td>
                        <span :class="$style['icon-detail']" @click="$emit('onInquire', info.username)" />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td :class="$style.title">{{ $text('S_COMMISSION_PAGE_TOTAL', '本页结果小计') }}</td>
                    <td :class="subTotal.bet < 0 ? $style['is-negative'] : $style['is-number']">{{ subTotal.bet }}</td>
                    <td :class="subTotal.valid_bet < 0 ? $style['is-negative'] : $style['is-number']">{{ subTotal.valid_bet }}</td>
                    <td :class="subTotal.payoff < 0 ? $style['is-negative'] : $style['is-number']">{{ subTotal.payoff }}</td>
                    <td />
                </tr>
                <tr>
                    <td :class="$style.title">{{ $text('S_COMMISSION_SEARCH_TOTAL', '搜寻结果总计') }}</td>
                    <td :class="total.bet < 0 ? $style['is-negative'] : $style['is-number']">{{ total.bet }}</td>
                    <td :class="total.valid_bet < 0 ? $style['is-negative'] : $style['is-number']">{{ total.valid_bet }}</td>
                    <td :class="total.payoff < 0 ? $style['is-negative'] : $style['is-number']">{{ total.payoff }}</td>
                    <td />
                </tr>
            </tfoot>
        </template>
    </table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        subTotal: {
            type: Object,
            default: () => ({})
        },
        total: {
            type: Object,
            default: () => ({})
        },
        sort: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    },
    methods: {
        onSort(sortBy) {
            if (this.sort.by === sortBy) {
                this.$emit('update:sort', {
                    ...this.sort,
                    way: this.sort.way === 'asc' ? 'desc' : 'asc'
                });
                return;
            }

            this.$emit('update:sort', {
                by: sortBy,
                way: 'asc'
            });
        }
    }
};
</script>


<style src="./css/table.scss" lang="scss" module></style>
