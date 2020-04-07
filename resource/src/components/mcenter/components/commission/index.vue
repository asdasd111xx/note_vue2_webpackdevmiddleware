<template>
    <div :class="[$style['commission-wrap'], $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <template v-if="isReceive && !showDetail">
            <div :class="$style['info-wrap']">
                <h1 :class="$style['title']">{{ $text('S_LAST_ASSIGN' ,'最近一期') }}</h1>
                <div class="clearfix">
                    <div :class="$style['commission-info-box']">
                        <span :class="$style['info-title']">{{ $text('S_COMMISSION_01' ,'佣金') }}</span>
                        <span :class="$style['info-subtitle']">Commission</span>
                        <span :class="$style['info-value']">{{ commissionLast.wage_amount | commaFormat }}</span>
                    </div>
                    <div :class="$style['betting-info-box']">
                        <span :class="$style['info-title']">{{ $text('S_VALID_BET_TOTAL', '总有效投注') }}</span>
                        <span :class="$style['info-subtitle']">Total Betting Amount</span>
                        <span :class="$style['info-value']">{{ commissionLast.valid_bet | commaFormat }}</span>
                    </div>
                    <div :class="$style['member-info-box']">
                        <span :class="$style['info-title']">{{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}</span>
                        <span :class="$style['info-subtitle']">Effective Member</span>
                        <span :class="$style['info-value']">{{ commissionLast.user_count }}</span>
                    </div>
                </div>
            </div>
            <div :class="$style['main-wrap']">
                <div :class="$style['title']">{{ $text('S_COMPUTE_WAGER_INTERVAL', '结算区间') }}</div>
                <div :class="[$style['search-wrap'], 'clearfix']">
                    <div :class="$style['select-wrap']">
                        <model-select
                            v-model="searchInfo.state"
                            :options="options"
                            :placeholder="options[0].text"
                        />
                    </div>
                    <div :class="$style['calendar-wrap']">
                        <datepicker
                            v-model="searchInfo.startTime"
                            :language="dateLang"
                            :disabled="{ to:limitDays, from: estToday }"
                            :monday-first="true"
                            format="yyyy-MM-dd"
                            class="calendar left"
                            input-class="calendar-input"
                        />
                        <span :class="$style['separator-line']">-</span>
                        <datepicker
                            v-model="searchInfo.endTime"
                            :language="dateLang"
                            :disabled="{ to:startTime, from: estToday }"
                            :monday-first="true"
                            format="yyyy-MM-dd"
                            class="calendar right"
                            input-class="calendar-input"
                        />
                    </div>
                    <div :class="$style['search-btn']" @click="setSearchInfo">{{ $text('S_INQUIRE', '查询') }}</div>
                </div>
                <div>
                    <table :class="$style['data-table']">
                        <thead>
                            <tr>
                                <th :class="$style['index']">{{ $text('S_NUMBER_NO' ,'序') }}</th>
                                <th :class="[$style['period'], { [$style['active']]: sort === 'period' }]" @click="setDataSort('period')">
                                    {{ $text('S_PERIOD_NAME' ,'期数名称') }}
                                    <icon
                                        v-if="sort === 'period'"
                                        :name="`${order === 'desc' ? 'caret-down' : 'caret-up'}`"
                                        width="15"
                                        height="15"
                                    />
                                    <icon
                                        v-else
                                        name="sort"
                                        width="15"
                                        height="15"
                                    />
                                </th>
                                <th :class="$style['datetime']">{{ $text('S_COMPUTE_WAGER_INTERVAL' ,'结算区间') }}</th>
                                <th :class="[$style['valid-bet'], { [$style['active']]: sort === 'sub_valid_bet' }]" @click="setDataSort('sub_valid_bet')">
                                    {{ $text('S_VALID_BET' ,'有效投注') }}
                                    <icon
                                        v-if="sort === 'sub_valid_bet'"
                                        :name="`${order === 'desc' ? 'caret-down' : 'caret-up'}`"
                                        width="15"
                                        height="15"
                                    />
                                    <icon
                                        v-else
                                        name="sort"
                                        width="15"
                                        height="15"
                                    />
                                </th>
                                <th :class="[$style['valid-user'], { [$style['active']]: sort === 'sub_user_count' }]" @click="setDataSort('sub_user_count')">
                                    {{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}
                                    <icon
                                        v-if="sort === 'sub_user_count'"
                                        :name="`${order === 'desc' ? 'caret-down' : 'caret-up'}`"
                                        width="15"
                                        height="15"
                                    />
                                    <icon
                                        v-else
                                        name="sort"
                                        width="15"
                                        height="15"
                                    />
                                </th>
                                <th :class="$style['commission']">{{ $text('S_COMMISSION_01' ,'佣金') }}</th>
                                <th :class="$style['state']">{{ $text('S_STATUS' ,'状态') }}</th>
                            </tr>
                        </thead>
                        <template v-if="commissionList.length">
                            <tbody>
                                <tr
                                    v-for="(info, index) in commissionList"
                                    :key="`list-${info.id}`"
                                    :class="{ [$style['clickable']]: info.state === 1 }"
                                    @click="showCommissionDetail(info)"
                                >
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ info.period }}</td>
                                    <td :class="$style['datetime-type']">{{ info.start_at | dataFormat }} ~ <br />{{ info.end_at | dataFormat }}</td>
                                    <td :class="[$style['money-type'], { [$style['hi-light-type']]: info.state === 1 }]"><span>{{ info.sub_valid_bet | commaFormat }}</span></td>
                                    <td>{{ info.sub_user_count }}</td>
                                    <td :class="$style['money-type']"><span>{{ info.amount | commaFormat }}</span></td>
                                    <td :class="$style[`state-${commissionState[info.state].key}`]">{{ $t(commissionState[info.state].text) }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td :class="$style['foot-title']" colspan="3">{{ $text('S_COMMISSION_PAGE_TOTAL' ,'本页结果小计') }}</td>
                                    <td :class="$style['money-type']"><span>{{ pageSubtotal.valid_bet | commaFormat }}</span></td>
                                    <td />
                                    <td :class="$style['money-type']"><span>{{ pageSubtotal.amount | commaFormat }}</span></td>
                                    <td />
                                </tr>
                                <tr>
                                    <td :class="$style['foot-title']" colspan="3">{{ $text('S_COMMISSION_SEARCH_TOTAL' ,'搜寻结果总计') }}</td>
                                    <td :class="$style['money-type']"><span>{{ allTotal.valid_bet | commaFormat }}</span></td>
                                    <td />
                                    <td :class="$style['money-type']"><span>{{ allTotal.amount | commaFormat }}</span></td>
                                    <td />
                                </tr>
                            </tfoot>
                        </template>
                        <template v-else>
                            <tbody>
                                <tr>
                                    <td :class="$style['no-data']" colspan="7">{{ $text('S_NO_DATA_YET') }}</td>
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
        <template v-if="showDetail">
            <detail
                :id="detailId"
                :period="detailPeriod"
                :on-close="closeCommissionDetail"
            />
        </template>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import datepicker from 'vuejs-datepicker';
import datepickerLang from '@/lib/datepicker_lang';
import EST from '@/lib/EST';
import mixin from './js/mixinIndex';
import pagination from '../../template/common/pagination';
import detail from './detail';

export default {
    components: {
        ModelSelect,
        datepicker,
        pagination,
        detail
    },
    mixins: [mixin],
    data() {
        const now = EST(new Date(), '', true);
        const start = new Date(Vue.moment(now).add(-29, 'days'));
        const limit = new Date(Vue.moment(now).add(-30, 'days'));

        return {
            estToday: now,
            startTime: start,
            endTime: now,
            limitDays: limit,
            searchInfo: {
                state: null,
                startTime: null,
                endTime: null
            },
            dateLang: datepickerLang(this.$i18n.locale),
            showDetail: false,
            detailId: '',
            detailPeriod: ''
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        stateValue: {
            get() {
                return this.state || this.searchInfo.state;
            },
            set(value) {
                this.searchInfo.state = value;
            }
        },
        startTimeValue: {
            get() {
                return this.startTime || this.searchInfo.startTime;
            },
            set(value) {
                this.searchInfo.startTime = value;
            }
        },
        endTimeValue: {
            get() {
                return this.endTime || this.searchInfo.endTime;
            },
            set(value) {
                this.searchInfo.endTime = value;
            }
        },
        options() {
            return Object.keys(this.commissionState).map((index) => ({
                value: index,
                text: this.$i18n.t(this.commissionState[index].text)
            }));
        }
    },
    created() {
        this.searchInfo.state = this.state;
        this.searchInfo.startTime = this.startTime;
        this.searchInfo.endTime = this.endTime;
    },
    methods: {
        setSearchInfo() {
            this.state = this.searchInfo.state;
            this.startTime = this.searchInfo.startTime;
            this.endTime = this.searchInfo.endTime;
            this.getListCommission();
        },
        closeCommissionDetail() {
            this.showDetail = false;
            this.detailId = '';
            this.detailPeriod = '';
        },
        showCommissionDetail({ id, period, state }) {
            if (state !== 1) {
                return;
            }

            this.detailId = id;
            this.detailPeriod = period;
            this.showDetail = true;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
