<template>
    <div :class="[$style['commission-wrap'], $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <list
            v-if="detailId === '' && detailPeriod === ''"
            :class="$style['commission-list-wrap']"
            :state="state"
            :start-time="startTime"
            :sort="sort"
            :end-time="endTime"
        >
            <template scope="{ commissionLast, commissionState, getListCommission, commissionList, setDataSort, pageSubtotal, allTotal, currentPage, totalPage, updatePage }">
                <table :class="$style['info-table']">
                    <thead>
                        <tr>
                            <th>{{ $text('S_COMMISSION_01' ,'佣金') }}</th>
                            <th>{{ $text('S_VALID_BET_TOTAL', '总有效投注') }}</th>
                            <th>{{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ commissionLast.wage_amount | commaFormat }}</td>
                            <td>{{ commissionLast.valid_bet | commaFormat }}</td>
                            <td>{{ commissionLast.user_count }}</td>
                        </tr>
                    </tbody>
                </table>
                <div :class="$style['search-wrap']">
                    <div :class="$style['search-bra']">
                        <span :class="[$style['search-icon'], { [$style['search-icon-nonuse']]: !isSearch, [$style['search-icon-use']]: isSearch }]" @click="openSearch" />
                    </div>
                    <div v-if="isSearch" :class="$style['search-form']">
                        <div :class="$style['form-row']">
                            <div :class="$style['form-title']">請選擇類別</div>
                            <select v-model="state">
                                <option
                                    v-for="(item, index) in commissionState"
                                    :key="`option-${item.key}`"
                                    :value="index"
                                >
                                    {{ $text(item.text) }}
                                </option>
                            </select>
                        </div>
                        <div :class="[$style['form-row'], 'clearfix']">
                            <div :class="$style['form-date-start']">
                                <div :class="$style['form-title']">{{ $text('S_STARTED_DAY', '起始日') }}</div>
                                <input v-model="startTime" type="date" />
                            </div>
                            <div :class="$style['form-date-end']">
                                <div :class="$style['form-title']">{{ $text('S_END_DAY', '结束日') }}</div>
                                <input v-model="endTime" type="date" />
                            </div>
                        </div>
                        <div :class="$style['submit-form-row']">
                            <div :class="$style['submit']" @click="getListCommission">{{ $text('S_INQUIRE', '查询') }}</div>
                        </div>
                    </div>
                </div>
                <div :class="$style['data-wrap']">
                    <template v-if="commissionList.length">
                        <table :class="$style['data-table']">
                            <thead>
                                <tr>
                                    <th :class="$style['index']">{{ $text('S_NUMBER_NO' ,'序') }}</th>
                                    <th :class="[$style['period'], { [$style['active']]: sort === 'period' }]" @click="setDataSort('period')">
                                        {{ $text('S_PERIOD_NAME' ,'期数名称') }}
                                        <icon
                                            v-if="sort === 'period'"
                                            :name="`${order === 'desc' ? 'long-arrow-alt-down' : 'long-arrow-alt-up'}`"
                                            width="5"
                                            height="10"
                                        />
                                        <span v-else>
                                            <icon
                                                name="long-arrow-alt-up"
                                                width="5"
                                                height="10"
                                            />
                                            <icon
                                                name="long-arrow-alt-down"
                                                width="5"
                                                height="10"
                                            />
                                        </span>
                                    </th>
                                    <th :class="$style['datetime']">{{ $text('S_COMPUTE_WAGER_INTERVAL' ,'结算区间') }}</th>
                                    <th :class="$style['state']">{{ $text('S_STATUS' ,'状态') }}</th>
                                    <th :class="$style['next']" />
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(info, index) in commissionList">
                                    <tr
                                        :key="`list-${info.id}`"
                                        @click="showCommissionDetail(info)"
                                    >
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ info.period }}</td>
                                        <td :class="$style['datetime-type']">
                                            <div>{{ info.start_at | dataFormat }}</div>
                                            <div>{{ info.end_at | dataFormat }}</div>
                                        </td>
                                        <td :class="$style[`state-${commissionState[info.state].key}`]">{{ $t(commissionState[info.state].text) }}</td>
                                        <td>
                                            <icon
                                                name="chevron-right"
                                                width="13"
                                                height="13"
                                            />
                                        </td>
                                    </tr>
                                    <tr
                                        v-show="info.id === subInfoId"
                                        :key="`sub-info-${info.id}`"
                                    >
                                        <td :class="$style['sub-info']" colspan="5">
                                            <div :class="[$style['info-wrap'], 'clearfix']">
                                                <div :class="$style['title']">{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                                                <div :class="$style['number']">{{ info.sub_valid_bet }}</div>
                                            </div>
                                            <div :class="[$style['info-wrap'], 'clearfix']">
                                                <div :class="$style['title']">{{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}</div>
                                                <div :class="$style['number']">{{ info.sub_user_count }}</div>
                                            </div>
                                            <div :class="[$style['info-wrap'], 'clearfix']">
                                                <div :class="$style['title']">{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                                                <div :class="$style['number']">{{ info.amount }}</div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                            <tfoot>
                                <tr :class="$style['foot-subtotal']">
                                    <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_PAGE_TOTAL' ,'本页结果小计') }}</td>
                                    <td :class="$style['text']">
                                        <div>{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                                        <div>{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                                    </td>
                                    <td :class="$style['money-type']" colspan="2">
                                        <span>{{ pageSubtotal.valid_bet | commaFormat }}</span>
                                        <span>{{ pageSubtotal.amount | commaFormat }}</span>
                                    </td>
                                </tr>
                                <tr :class="$style['foot-total']">
                                    <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_SEARCH_TOTAL' ,'搜寻结果总计') }}</td>
                                    <td :class="$style['text']">
                                        <div>{{ $text('S_VALID_BET' ,'有效投注') }}</div>
                                        <div>{{ $text('S_COMMISSION_01' ,'佣金') }}</div>
                                    </td>
                                    <td :class="$style['money-type']" colspan="2">
                                        <span>{{ allTotal.valid_bet | commaFormat }}</span>
                                        <span>{{ allTotal.amount | commaFormat }}</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <pagintaion
                            :class="$style.pagination"
                            :page="+currentPage"
                            :total="totalPage"
                            @update:page="(value) => { updatePage(value); }"
                        />
                    </template>
                    <template v-else>
                        <div :class="$style['no-data']">
                            <img :class="$style['icon-nodate']" src="/static/image/mcenter/icon_noinformation.png" />
                            {{ $text('S_NO_DATA_GENERATED', '尚未产生数据') }}
                        </div>
                    </template>
                </div>
            </template>
        </list>
        <detail
            v-if="detailId !== '' && detailPeriod !== ''"
            :id="detailId"
            :class="$style['commission-detail-wrap']"
            :period="detailPeriod"
            :state="detailState"
        >
            <!-- eslint-disable vue/no-template-shadow -->
            <template scope="{ state, period, levelTrans, levelList, levelTotle, firstLevelList, sort, order, setDataSort, pageSubtotal, allTotal, currentPage, totalPage, updatePage }">
                <!-- eslint-enable vue/no-template-shadow -->
                <detail-info
                    :state="state"
                    :period="period"
                    :level-trans="levelTrans"
                    :level-list="levelList"
                    :level-totle="levelTotle"
                />
                <div v-if="!firstLevelList.length" :class="$style['no-data']">{{ $text('S_NO_DATA_TPL') }}</div>
                <div v-if="firstLevelList.length">
                    <table :class="$style['detail-data-table']">
                        <thead>
                            <tr>
                                <th :class="$style['index']">{{ $text('S_NUMBER_NO' ,'序') }}</th>
                                <th :class="$style['first-level']">{{ $text('S_FIRST_LEVEL_FRIEND' ,'一级好友') }}</th>
                                <th :class="[$style['valid-bet'], { [$style['active']]: sort === 'valid_bet' }]" @click="setDataSort('valid_bet')">
                                    {{ $text('S_VALID_BET' ,'有效投注') }}
                                    <icon
                                        v-if="sort === 'period'"
                                        :name="`${order === 'desc' ? 'long-arrow-alt-down' : 'long-arrow-alt-up'}`"
                                        width="5"
                                        height="10"
                                    />
                                    <span v-else>
                                        <icon
                                            name="long-arrow-alt-up"
                                            width="5"
                                            height="10"
                                        />
                                        <icon
                                            name="long-arrow-alt-down"
                                            width="5"
                                            height="10"
                                        />
                                    </span>
                                </th>
                                <th :class="$style['commission']">{{ $text('S_COMMISSION_01' ,'佣金') }}</th>
                            </tr>
                        </thead>
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
                            <tr :class="$style['foot-subtotal']">
                                <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_PAGE_TOTAL' ,'本页结果小计') }}</td>
                                <td :class="$style['money-type']"><span>{{ pageSubtotal.valid_bet | commaFormat }}</span></td>
                                <td :class="$style['money-type']"><span>{{ pageSubtotal.amount | commaFormat }}</span></td>
                            </tr>
                            <tr :class="$style['foot-total']">
                                <td :class="$style['foot-title']" colspan="2">{{ $text('S_COMMISSION_SEARCH_TOTAL' ,'搜寻结果总计') }}</td>
                                <td :class="$style['money-type']"><span>{{ allTotal.valid_bet | commaFormat }}</span></td>
                                <td :class="$style['money-type']"><span>{{ allTotal.amount | commaFormat }}</span></td>
                            </tr>
                        </tfoot>
                    </table>
                    <pagintaion
                        :class="$style.pagination"
                        :page="+currentPage"
                        :total="totalPage"
                        @update:page="(value) => { updatePage(value); }"
                    />
                </div>
            </template>
        </detail>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import EST from '@/lib/EST';
import list from '@/components/common/mcenter/commission/list';
import detail from '@/components/common/mcenter/commission/detail';
import detailInfo from './detail/info';
import pagintaion from '../../../pagination';

export default {
    components: {
        list,
        detail,
        detailInfo,
        pagintaion
    },
    filters: {
        pointFormat(value, digit = 2) {
            if (typeof value === 'undefined') {
                return '--';
            }
            return Number(value).toFixed(digit);
        },
        commaFormat(value) {
            if (typeof value === 'undefined') {
                return '--';
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        dataFormat(value, format = 'YYYY-MM-DD') {
            if (typeof value === 'undefined') {
                return '--';
            }
            return Vue.moment(value).utcOffset(-4).format(format);
        }
    },
    props: {
        setTabState: {
            type: Function,
            required: true
        },
        setHeaderTitle: {
            type: Function,
            required: true
        }
    },
    data() {
        const now = EST(new Date(), '', true);
        const limit = new Date(Vue.moment(now).add(-29, 'days'));

        return {
            isSearch: true,
            state: '0',
            startTime: Vue.moment(limit).format('YYYY-MM-DD'),
            endTime: Vue.moment(now).format('YYYY-MM-DD'),
            sort: '',
            subInfoId: '',
            detailState: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            siteConfig: 'getSiteConfig'
        }),
        detailId() {
            return this.$route.params.id || '';
        },
        detailPeriod() {
            return this.$route.params.period || '';
        }
    },
    watch: {
        startTime() {
            if (this.startTime > this.endTime) {
                this.endTime = this.startTime;
            }
        }
    },
    created() {
        // 當開啟第三方佣金時，則跳轉回首頁
        if (this.memInfo.config.wage) {
            this.$router.push('/mobile');
        }
    },
    methods: {
        openSearch() {
            this.isSearch = !this.isSearch;
        },
        showCommissionDetail({ id, period, state }) {
            if (state !== 1) {
                if (this.subInfoId === id) {
                    this.subInfoId = '';
                    return;
                }

                this.subInfoId = id;
                return;
            }

            this.setTabState(false);
            this.detailState = 'S_ASSIGN_ALREADY';
            this.$router.push(`/mobile/mcenter/tcenter/commission/${id}/${period}`);
        }
    }
};
</script>

<style lang="scss" module>
.info-table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;

    th,
    td {
        padding: 3px 5px;
        width: 33%;
        border-right: 1px solid #000;
        background-color: #00347D;
    }
    th {
        color: #ABCDFE;
    }
    td {
        color: #F4D8AF;
    }
}
.search-bra {
    padding: 5px 10px;
    border-bottom: 1px solid #BEBCBC;
    background-color: #DDD;

    .search-icon {
        display: block;
        width: 26px;
        height: 26px;
        background-size: cover;

        &.search-icon-nonuse {
            background-image: url('/static/image/mobile/mcenter/btn_inquire.png');
        }

        &.search-icon-use {
            background-image: url('/static/image/mobile/mcenter/btn_inquire_h.png');
        }
    }
}
.search-form {
    background-color: #FFF;
    .form-row {
        border-bottom: 1px solid #BEBCBC;

        select {
            width: 100%;
            outline: none;
            background: transparent;
            border: none;
            appearance: none;
        }
        input {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            appearance: none;
        }
    }
    .submit-form-row {
        padding: 8px 0;
        text-align: center;
        border-bottom: 1px solid #BEBCBC;

        .submit {
            display: inline-block;
            width: 70%;
            height: 30px;
            line-height: 30px;
            color: #FFF;
            text-align: center;
            border-radius: 5px;
            background-color: #00347D;
        }
    }
    .form-title {
        padding: 5px 0 0 5px;
        color: #BEBCBC;
    }
    .form-date-start,
    .form-date-end {
        float: left;
        width: 50%;
    }
    .form-date-start {
        border-right: 1px solid #BEBCBC;
    }
}

.data-wrap {
    padding-top: 9px;
    height: 100%;

    .no-data {
        margin-top: 122px;
        color: #DDD;
        text-align: center;
    }
    .icon-nodate {
        display: block;
        margin: 0 auto 8px;
        width: 16%;
    }
}

.data-table {
    margin-bottom: 50px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    border-spacing: 0;
    border-collapse: collapse;

    tr {
        border-top: 1px solid #BBB;
        border-bottom: 1px solid #BBB;
    }

    thead {
        th {
            color: #666;
            font-weight: normal;
            background-color: #DDD;

            &.index {
                width: 10%;
            }
            &.period {
                width: 28%;
                cursor: pointer;
            }
            &.datetime {
                width: 25%;
            }
            &.state {
                width: 28%;
            }
            &.next {
                width: 9%;
            }
        }
    }
    tbody {
        .datetime-type {
            div {
                display: inline-block;
                width: 65px;
                text-align: left;
            }
        }
        .sub-info {
            padding: 3% 0 0;
            background-color: #EEE;
        }
        .info-wrap {
            line-height: 12px;
            padding-bottom: 3%;
            font-size: 12px;

            .title {
                width: 35%;
                padding: 0 3%;
                color: #353B5D;
            }
            .number {
                width: 65%;
                color: #353B5D;
            }

            div {
                overflow: hidden;
                float: left;
                text-align: left;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        td {
            &.state-yet {
                color: #52B8FF;
            }
            &.state-unqualified {
                color: #FF5454;
            }
        }
    }

    tfoot {
        text-align: left;

        .foot-subtotal,
        .foot-total {
            background-color: #DDD;
        }

        td {
            &.foot-title {
                padding: 0 4% 0 7%;
            }
            &.money-type {
                span {
                    display: block;
                    padding: 0 4%;
                    margin: 0 auto;
                    text-align: right;
                }
            }
            &.text {
                text-align: center;

                div {
                    width: 65px;
                    margin: 0 auto;
                    text-align: left;
                }
            }
        }
    }
}

.detail-data-table {
    margin: 8px 0 50px;
    width: 100%;
    font-size: 12px;
    text-align: center;
    border-spacing: 0;
    border-collapse: collapse;

    tr {
        border-top: 1px solid #BBB;
        border-bottom: 1px solid #BBB;
    }

    td {
        &.money-type {
            span {
                display: block;
                margin: 0 auto;
                width: 70%;
                text-align: right;
            }
        }
    }

    thead {
        th {
            color: #666;
            font-weight: normal;
            background-color: #DDD;

            &.index {
                width: 10%;
            }
            &.first-level {
                width: 28%;
                cursor: pointer;
            }
            &.valid-bet {
                width: 31%;
            }
            &.commission {
                width: 31%;
            }
        }
    }
    tbody {
        td {
            background-color: #FFF;
        }
    }

    tfoot {
        text-align: left;

        .foot-subtotal,
        .foot-total {
            background-color: #DDD;
        }

        td {
            &.foot-title {
                padding: 0 4% 0 7%;
            }
        }
    }
}
.pagination {
    position: fixed;
    bottom: 55px;
}

.no-data {
    width: 100%;
    text-align: center;
    padding: 6px 6px;
}

.theme-miller {
    .info-table {
        th,
        td {
            background-color: #2C2F2F;
        }
        th {
            color: #CFCFCF;
        }
        td {
            color: #EFD495;
        }
    }
    .submit-form-row {
        .submit {
            background-color: #F7B500;
        }
    }
}
</style>
