<template>
    <div v-if="isReceive" :class="[$style['commission-detail-wrap'], $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <div :class="$style['info-wrap']">
            <div :class="$style['breadcrumbs-wrap']">
                <span :class="$style['title']" @click="onClose()">{{ $text('S_MY_COMMISSION' ,'我的佣金') }}</span>&nbsp;>&nbsp;{{ period }}
            </div>
            <div :class="[$style['level-wrap'], 'clearfix']">
                <div
                    v-for="item in levelList"
                    :key="`level-${item.depth}`"
                    :class="$style['level-info-box']"
                >
                    <div :class="$style['info-title']">{{ $text(levelTrans[item.depth]) }}</div>
                    <div :class="$style['info-subtitle']">{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                    <div :class="$style['info-money']">{{ item.amount | commaFormat }}</div>
                    <div :class="$style['info-subtitle']">{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                    <div :class="$style['info-money']">{{ item.valid_bet | commaFormat }}</div>
                </div>
                <div :class="$style['level-total-box']">
                    <div :class="$style['info-title']">{{ $text('S_TOTAL' ,'总计') }}</div>
                    <div :class="$style['info-subtitle']">{{ $text('S_COMMISSION_TOTAL' ,'佣金总计') }}</div>
                    <div :class="$style['info-money']">{{ leveltotle.amount | commaFormat }}</div>
                    <div :class="$style['info-subtitle']">{{ $text('S_VALID_BET_TOTAL_01' ,'有效投注总计') }} </div>
                    <div :class="$style['info-money']">{{ leveltotle.valid_bet | commaFormat }}</div>
                </div>
            </div>
        </div>
        <div :class="$style['main-wrap']">
            <table :class="$style['data-table']">
                <thead>
                    <tr>
                        <th :class="$style['index']">{{ $text('S_NUMBER_NO' ,'序') }}</th>
                        <th :class="$style['first-level']">{{ $text('S_FIRST_LEVEL_FRIEND' ,'一级好友') }}</th>
                        <th :class="$style['valid-bet']" @click="setDataSort('valid_bet')">
                            {{ $text('S_VALID_BET' ,'有效投注') }}
                            <icon
                                name="sort"
                                width="15"
                                height="15"
                            />
                        </th>
                        <th :class="$style['commission']">{{ $text('S_COMMISSION_01' ,'佣金') }}</th>
                    </tr>
                </thead>
                <template v-if="firstLevelList.length">
                    <tbody>
                        <tr
                            v-for="(info, index) in firstLevelList"
                            :key="`list-${info.id}`"
                        >
                            <td>{{ index + 1 }}</td>
                            <td>{{ info.username }}</td>
                            <td :class="[$style['money-type'], $style['hi-light-type']]"><span>{{ info.valid_bet | commaFormat }}</span></td>
                            <td :class="$style['money-type']"><span>{{ info.wage_amount | commaFormat }}</span></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_PAGE_TOTAL' ,'本页结果小计') }}</td>
                            <td :class="$style['money-type']"><span>{{ pageSubtotal.valid_bet | commaFormat }}</span></td>
                            <td :class="$style['money-type']"><span>{{ pageSubtotal.amount | commaFormat }}</span></td>
                        </tr>
                        <tr>
                            <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_SEARCH_TOTAL' ,'搜寻结果总计') }}</td>
                            <td :class="$style['money-type']"><span>{{ allTotal.valid_bet | commaFormat }}</span></td>
                            <td :class="$style['money-type']"><span>{{ allTotal.amount | commaFormat }}</span></td>
                        </tr>
                    </tfoot>
                </template>
                <template v-else>
                    <tbody>
                        <tr>
                            <td :class="$style['no-data']" colspan="4">{{ $text('S_NO_DATA_YET') }}</td>
                        </tr>
                    </tbody>
                </template>
            </table>
            <template v-if="totalPage">
                <pagination :current.sync="currentPage" :total.sync="totalPage" />
            </template>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mixin from './js/mixinDetail';
import pagination from '../../template/common/pagination';

export default {
    components: {
        pagination
    },
    mixins: [mixin],
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>

<style lang="scss" src="./css/detail.scss" module></style>
