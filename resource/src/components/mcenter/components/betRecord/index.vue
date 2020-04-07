<template>
    <div class="bet-record">
        <div ref="totalAreaWrap" class="total-area-wrap">
            <div class="main-title clearfix">
                <h1>{{ $t('S_TOTAL_STAKE') }}</h1>
            </div>
            <div v-if="allTotalData" class="total-area clearfix">
                <div
                    v-for="(item, key) in allTotalData"
                    :key="key"
                    :class="['total-item', 'clearfix', key]"
                    @click="quickInquire(key)"
                >
                    <div class="total-item-title">
                        <!-- 斷行文字會有空格, 不斷行 -->
                        <span>{{ $t(item.text) }}</span>
                    </div>
                    <div class="total-item-date-money">
                        <div class="total-item-date">
                            <span>{{ item.startShow }}</span>
                            <span>-</span>
                            <span>{{ item.endShow }}</span>
                        </div>
                        <div class="total-item-money">
                            <span>{{ item.money }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-title clearfix">
            <template v-if="!openStatus">
                <span>{{ $t('S_BETHISTORYBTN') }}</span>
            </template>
            <template v-else>
                <span class="pointer" @click="openStatus = false">{{ $t('S_BETHISTORYBTN') }}</span>
                <span class="detial">
                    <span class="arrow">>&nbsp;&nbsp;{{ detailTitle }}</span>
                </span>
            </template>
        </div>
        <template v-if="!openStatus">
            <div class="bet-record-field clearfix">
                <div class="select-list">
                    <input
                        v-show="false"
                        v-model="type"
                        name="type"
                    />
                    <model-select
                        v-model="type"
                        :options="options"
                        :placeholder="$t('S_ALL')"
                    />
                </div>
                <div class="main-calendar-wrap clearfix">
                    <span :title="$t('S_WAGER_TIME')" class="date-text">{{ $t('S_WAGER_TIME') }}</span>
                    <datepicker
                        v-model="startTime"
                        :language="dateLang"
                        :disabled="{ to:limitDays, from: estToday }"
                        :monday-first="true"
                        format="yyyy-MM-dd"
                        class="main-calendar left"
                        input-class="main-input"
                    />
                    <span class="date-line">-</span>
                    <datepicker
                        v-model="endTime"
                        :language="dateLang"
                        :disabled="{ to:startTime, from: estToday }"
                        :monday-first="true"
                        format="yyyy-MM-dd"
                        class="main-calendar right"
                        input-class="main-input"
                    />
                </div>
                <!-- <div class="fast-btn-wrap clearfix">
                    <div class="main-input today" @click="setDayAgo(0)">{{ $t('S_TODDAY') }}</div>
                    <div class="main-input yesterday" @click="setYesterday()">{{ $t('S_YESTERDAY') }}</div>
                    <div class="main-input week" @click="setDayAgo(6)">{{ $t('S_LATELY_WEEK') }}</div>
                </div> -->
                <div class="main-btn inquire-btn" @click="inquire()">{{ $t('S_INQUIRE') }}</div>
            </div>
            <table class="main-table">
                <thead class="mcenter-pc">
                    <tr>
                        <th class="number">{{ $t('S_NUMBER_NO') }}</th>
                        <th class="name">{{ $t('S_PLATFORM') }}</th>
                        <th :class="`amount ${selectDataType.platform.sort === 'bet' ? 'active' : ''}`" @click="inquire('bet')">
                            {{ $t('S_WAGER_AMOUNT') }}
                            <icon
                                v-if="selectDataType.platform.sort === 'bet'"
                                :name="`${selectDataType.platform.order === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                        <th :class="`valid ${selectDataType.platform.sort === 'valid_bet' ? 'active' : ''}`" @click="inquire('valid_bet')">
                            {{ $t('S_VALID_BET') }}
                            <icon
                                v-if="selectDataType.platform.sort === 'valid_bet'"
                                :name="`${selectDataType.platform.order === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                        <th :class="`result ${selectDataType.platform.sort === 'payoff' ? 'active' : ''}`" @click="inquire('payoff')">
                            {{ $t('S_PAY_OUT') }}
                            <icon
                                v-if="selectDataType.platform.sort === 'payoff'"
                                :name="`${selectDataType.platform.order === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                        <th class="detail">{{ $t('S_FUNCTION') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="mainNoData">
                        <tr><td colspan="6" class="no-data">{{ $t('S_NO_DATA_YET') }}</td></tr>
                    </template>
                    <template v-else>
                        <template v-for="(list, index) in showDataList">
                            <tr :key="`pc-${index}`" class="mcenter-pc">
                                <td class="number">{{ index + 1 }}</td>
                                <td class="name">{{ list.text }}</td>
                                <td class="amount">{{ list.bet }}</td>
                                <td class="valid">{{ list.valid_bet }}</td>
                                <td :class="`result ${Number(list.payoff) < 0 ? 'negative' : ''}`">{{ list.payoff }}</td>
                                <td class="detail">
                                    <span @click="read(list.vendor, list.kind, 'getData', 1)" />
                                </td>
                            </tr>
                            <table :key="`pad-${index}`" class="pad">
                                <tr class="number">
                                    <td colspan="2">{{ index + 1 }}</td>
                                </tr>
                                <tr>
                                    <td class="name caption">{{ $t('S_PLATFORM') }}</td>
                                    <td class="name content">{{ list.text }}</td>
                                </tr>
                                <tr>
                                    <td class="amount caption">{{ $t('S_WAGER_AMOUNT') }}</td>
                                    <td class="amount content">{{ list.bet }}</td>
                                </tr>
                                <tr>
                                    <td class="valid caption">{{ $t('S_VALID_BET') }}</td>
                                    <td class="valid content">{{ list.valid_bet }}</td>
                                </tr>
                                <tr>
                                    <td class="result caption">{{ $t('S_PAY_OUT') }}</td>
                                    <td :class="`result content ${Number(list.payoff) < 0 ? 'negative' : ''}`">{{ list.payoff }}</td>
                                </tr>
                                <tr>
                                    <td class="detail caption">{{ $t('S_FUNCTION') }}</td>
                                    <td class="detail content">
                                        <span @click="read(list.vendor, list.kind, 'getData', 1)" />
                                    </td>
                                </tr>
                            </table>
                        </template>
                    </template>
                    <template v-if="mainTotal">
                        <tr class="total mcenter-pc">
                            <td class="title" colspan="2">{{ $t('S_TOTAL') }}</td>
                            <td class="amount">{{ mainTotal.bet ? mainTotal.bet.toFixed(2) : '' }}</td>
                            <td class="valid">{{ mainTotal.valid_bet ? mainTotal.valid_bet.toFixed(2) : '' }}</td>
                            <td :class="`result ${Number(mainTotal.payoff) < 0 ? 'negative' : ''}`">{{ mainTotal.payoff ? mainTotal.payoff.toFixed(2) : '' }}</td>
                            <td class="detail" />
                        </tr>
                        <table class="pad">
                            <tr class="title">
                                <td colspan="2">{{ $t('S_TOTAL') }}</td>
                            </tr>
                            <tr>
                                <td class="amount caption">{{ $t('S_WAGER_AMOUNT') }}</td>
                                <td class="amount content">{{ mainTotal.bet ? mainTotal.bet.toFixed(2) : '' }}</td>
                            </tr>
                            <tr>
                                <td class="valid caption">{{ $t('S_VALID_BET') }}</td>
                                <td class="valid content">{{ mainTotal.valid_bet ? mainTotal.valid_bet.toFixed(2) : '' }}</td>
                            </tr>
                            <tr>
                                <td class="result caption">{{ $t('S_PAY_OUT') }}</td>
                                <td :class="`result content ${Number(mainTotal.payoff) < 0 ? 'negative' : ''}`">{{ mainTotal.payoff ? mainTotal.payoff.toFixed(2) : '' }}</td>
                            </tr>
                        </table>
                    </template>
                </tbody>
            </table>
            <div class="page-wrap">
                <span :class="`page-first${mainPageNow === 1 ? ' disable' : ''}`" @click="mainPageNow === 1 ? '' : mainPageChange(1)" />
                <span :class="`page-pre${mainPageNow === 1 ? ' disable' : ''}`" @click="mainPageNow === 1 ? '' : mainPageChange(mainPageNow - 1)" />
                <div class="page-select-wrap">
                    <select
                        v-model="mainPageNow"
                        class="page-select"
                        @change="mainPageChange(mainPageNow)"
                    >
                        <option
                            v-for="num in mainPageAll"
                            :key="num"
                            :value="num">
                            {{ num }}
                        </option>
                    </select>
                    <span class="page-total">/&nbsp;{{ mainPageAll }}</span>
                </div>
                <span :class="`page-next${mainPageNow === mainPageAll ? ' disable' : ''}`" @click="mainPageNow === mainPageAll ? '' : mainPageChange(mainPageNow + 1)" />
                <span :class="`page-last${mainPageNow === mainPageAll ? ' disable' : ''}`" @click="mainPageNow === mainPageAll ? '' : mainPageChange(mainPageAll)" />
            </div>
        </template>
        <template v-else>
            <div class="back-btn-wrap clearfix">
                <div v-if="settleSwitch" class="main-radio-wrap clearfix">
                    <div class="main-radio">
                        <input
                            id="record-yet"
                            v-model="settleSelect"
                            type="radio"
                            name="promotion-class"
                            @click="read(detailVendor, detailKind, 'getData', 1)"
                        />{{ $t('S_UNCOMPUTE_STR') }}
                        <label for="record-yet">
                            <span class="radio-style" />
                        </label>
                    </div>
                    <div class="main-radio">
                        <input
                            id="record-already"
                            v-model="settleSelect"
                            type="radio"
                            name="promotion-class"
                            @click="read(detailVendor, detailKind, 'getData', 1)"
                        />{{ $t('S_COMPUTED_STR') }}
                        <label for="record-already">
                            <span class="radio-style" />
                        </label>
                    </div>
                </div>
                <div class="main-btn" @click="openStatus = false">{{ $t('S_BACK_PAGE') }}</div>
            </div>
            <table class="main-table detial">
                <thead class="mcenter-pc">
                    <tr>
                        <th class="number">{{ $t('S_NUMBER_NO') }}</th>
                        <th class="name">{{ $t('S_GAMETYPE2') }}</th>
                        <th class="quantity">{{ $t('S_MA_NUM_BETS') }}</th>
                        <th :class="`amount ${selectDataType.gameItem.sort === 'bet' ? 'active' : ''}`" @click="read(detailVendor, detailKind, 'detailPageChange', detailPageNow, 'bet')">
                            {{ $t('S_WAGER_AMOUNT') }}
                            <icon
                                v-if="selectDataType.gameItem.sort === 'bet'"
                                :name="`${selectDataType.gameItem.order === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                        <th :class="`valid ${selectDataType.gameItem.sort === 'valid_bet' ? 'active' : ''}`" @click="read(detailVendor, detailKind, 'detailPageChange', detailPageNow, 'valid_bet')">
                            {{ $t('S_VALID_BET') }}
                            <icon
                                v-if="selectDataType.gameItem.sort === 'valid_bet'"
                                :name="`${selectDataType.gameItem.order === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                        <th :class="`result ${selectDataType.gameItem.sort === 'payoff' ? 'active' : ''}`" @click="read(detailVendor, detailKind, 'detailPageChange', detailPageNow, 'payoff')">
                            {{ $t('S_PAY_OUT') }}
                            <icon
                                v-if="selectDataType.gameItem.sort === 'payoff'"
                                :name="`${selectDataType.gameItem.order === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(list, index) in detailListData">
                        <tr :key="`pc-${index}`" class="mcenter-pc">
                            <td class="number">{{ index + 1 }}</td>
                            <td class="name">{{ list.text }}</td>
                            <td class="quantity">{{ list.counts }}</td>
                            <td class="amount">{{ list.bet }}</td>
                            <td class="valid">{{ list.valid_bet }}</td>
                            <td :class="`result ${Number(list.payoff) < 0 ? 'negative' : ''}`">{{ list.payoff }}</td>
                        </tr>
                        <table :key="`pad-${index}`" class="pad">
                            <tr class="number">
                                <td colspan="2">{{ index + 1 }}</td>
                            </tr>
                            <tr>
                                <td class="name caption">{{ $t('S_GAMETYPE2') }}</td>
                                <td class="name content">{{ list.text }}</td>
                            </tr>
                            <tr>
                                <td class="quantity caption">{{ $t('S_MA_NUM_BETS') }}</td>
                                <td class="quantity content">{{ list.counts }}</td>
                            </tr>
                            <tr>
                                <td class="amount caption">{{ $t('S_WAGER_AMOUNT') }}</td>
                                <td class="amount content">{{ list.bet }}</td>
                            </tr>
                            <tr>
                                <td class="valid caption">{{ $t('S_VALID_BET') }}</td>
                                <td class="valid content">{{ list.valid_bet }}</td>
                            </tr>
                            <tr>
                                <td class="result caption">{{ $t('S_PAY_OUT') }}</td>
                                <td :class="`result content ${Number(list.payoff) < 0 ? 'negative' : ''}`">{{ list.payoff }}</td>
                            </tr>
                        </table>
                    </template>
                    <template v-if="detailTotal">
                        <tr class="total mcenter-pc">
                            <td class="title" colspan="3">{{ $t('S_TOTAL') }}</td>
                            <td class="amount">{{ detailTotal.bet }}</td>
                            <td class="valid">{{ detailTotal.valid_bet }}</td>
                            <td :class="`result ${Number(detailTotal.payoff) < 0 ? 'negative' : ''}`">{{ detailTotal.payoff }}</td>
                        </tr>
                        <table class="pad">
                            <tr class="title">
                                <td colspan="2">{{ $t('S_TOTAL') }}</td>
                            </tr>
                            <tr>
                                <td class="amount caption">{{ $t('S_WAGER_AMOUNT') }}</td>
                                <td class="amount content">{{ detailTotal.bet }}</td>
                            </tr>
                            <tr>
                                <td class="valid caption">{{ $t('S_VALID_BET') }}</td>
                                <td class="valid content">{{ detailTotal.valid_bet }}</td>
                            </tr>
                            <tr>
                                <td class="result caption">{{ $t('S_PAY_OUT') }}</td>
                                <td :class="`result content ${Number(detailTotal.payoff) < 0 ? 'negative' : ''}`">{{ detailTotal.payoff }}</td>
                            </tr>
                        </table>
                    </template>
                </tbody>
            </table>
            <div class="page-wrap">
                <span :class="`page-first${detailPageNow === 1 ? ' disable' : ''}`" @click="detailPageNow === 1 ? '' : read(detailVendor, detailKind, 'detailPageChange', 1)" />
                <span :class="`page-pre${detailPageNow === 1 ? ' disable' : ''}`" @click="detailPageNow === 1 ? '' : read(detailVendor, detailKind, 'detailPageChange', detailPageNow - 1)" />
                <div class="page-select-wrap">
                    <select
                        v-model="detailPageNow"
                        class="page-select"
                        @change="read(detailVendor, detailKind, 'detailPageChange', detailPageNow)"
                    >
                        <option
                            v-for="num in detailPageAll"
                            :key="num"
                            :value="num"
                        >
                            {{ num }}
                        </option>
                    </select>
                    <span class="page-total">/&nbsp;{{ detailPageAll }}</span>
                </div>
                <span :class="`page-next${detailPageNow === detailPageAll ? ' disable' : ''}`" @click="detailPageNow === detailPageAll ? '' : read(detailVendor, detailKind, 'detailPageChange', detailPageNow + 1)" />
                <span :class="`page-last${detailPageNow === detailPageAll ? ' disable' : ''}`" @click="detailPageNow === detailPageAll ? '' : read(detailVendor, detailKind, 'detailPageChange', detailPageAll)" />
            </div>
        </template>
    </div>
</template>

<script>
/* global $ */
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import datepicker from 'vuejs-datepicker';
import EST from '@/lib/EST';
import game from '@/api/game';
import mcenter from '@/api/mcenter';
import datepickerLang from '@/lib/datepicker_lang';
import gameName from '@/lib/game_name';

export default {
    components: {
        ModelSelect,
        datepicker
    },
    data() {
        return {
            allTotalData: {},
            limitDays: '',
            estToday: EST(new Date(), '', true),
            dateLang: datepickerLang(this.$i18n.locale),
            options: [{ value: 'all', text: this.$t('S_ALL') }],
            numMax: 10, // 每頁顯示幾筆
            mainListData: [],
            mainTotal: {
                bet: 0,
                valid_bet: 0,
                payoff: 0
            },
            mainTotalCount: 0,
            mainPageAll: 1, // 外層總頁數
            mainPageNow: 1, // 外層當前頁
            mainNoData: true,
            startTime: '',
            endTime: '',
            detailListData: [],
            detailTotal: {},
            detailVendor: '', // 內層選定的vendor (供分頁用)
            detailKind: '', // 內層選定的kind (供分頁用)
            detailTotalCount: 0,
            detailNumFirst: 0, // 內層每頁起始序
            detailPageAll: 1, // 內層總頁數
            detailPageNow: 1, // 內層當前頁
            type: 'all',
            detailStartTime: '',
            detailEndTime: '',
            openStatus: false,
            detailTitle: '',
            settleSwitch: false,
            settleSelect: false,
            selectDataType: {
                platform: { },
                gameItem: { }
            }
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData',
            CurLang: 'getCurLang'
        }),
        showDataList() {
            let result = [];
            result = this.mainListData.filter((data, index) => index >= (this.mainPageNow - 1) * this.numMax && index < this.mainPageNow * this.numMax);
            return result;
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
        this.actionSetIsLoading(true);
        mcenter.betRecordTotal({
            success: (response) => {
                const temp = response.ret;
                const textObj = {
                    today: 'S_TODDAY',
                    yesterday: 'S_YESTERDAY',
                    this_week: 'THIS_WEEK',
                    last_week: 'S_LAST_WEEK',
                    this_month: 'THIS_MONTH',
                    last_month: 'LAST_MONTH'
                };
                const tempData = {};

                Object.keys(temp).forEach((index) => {
                    tempData[index] = {
                        start: temp[index].start_at,
                        end: temp[index].end_at,
                        startShow: Vue.moment(temp[index].start_at).format('MM/DD'),
                        endShow: Vue.moment(temp[index].end_at).format('MM/DD'),
                        money: +temp[index].total !== 0 ? Number(temp[index].total).toFixed(2) : +temp[index].total,
                        text: textObj[index]
                    };
                });

                this.allTotalData = tempData;
            }
        })
            .then(() => {
                this.actionSetIsLoading(false);
            });
        this.limitDays = new Date(Vue.moment(this.estToday).add(-31, 'days'));
        this.setDayAgo(0);
        this.inquire();
        Object.keys(this.gameData).forEach((index) => {
            const { vendor } = this.gameData[index];
            if (this.gameData[index].switch === 'Y' && this.options.map((item) => item.value).indexOf(vendor) === -1) {
                this.options.push({ value: vendor, text: gameName(vendor) });
            }
        });
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ]),
        accAdd(arg1, arg2) {
            let r1;
            let r2;
            let n1 = arg1;
            let n2 = arg2;
            try {
                r1 = n1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = n2.toString().split('.')[1].length;
            } catch (e) {
                r2 = 0;
            }
            const c = Math.abs(r1 - r2);
            const m = Math.pow(10, Math.max(r1, r2)); // eslint-disable-line no-restricted-properties
            const cm = Math.pow(10, c); // eslint-disable-line no-restricted-properties
            if (c > 0 && r1 > r2) {
                n1 = Number(n1.toString().replace('.', ''));
                n2 = Number(n2.toString().replace('.', '')) * cm;
                return (n1 + n2) / m;
            }
            if (c > 0 && r1 <= r2) {
                n1 = Number(n1.toString().replace('.', '')) * cm;
                n2 = Number(n2.toString().replace('.', ''));
                return (n1 + n2) / m;
            }
            n1 = Number(n1.toString().replace('.', ''));
            n2 = Number(n2.toString().replace('.', ''));
            return (n1 + n2) / m;
        },
        setDayAgo(days) {
            this.startTime = new Date(Vue.moment(this.estToday).add(-days, 'days'));
            this.endTime = this.estToday;
        },
        setYesterday() {
            this.startTime = new Date(Vue.moment(this.estToday).add(-1, 'days'));
            this.endTime = this.startTime;
        },
        quickInquire(key) {
            if (key === 'last_month') {
                return;
            }
            const data = this.allTotalData[key];

            this.type = 'all';
            this.startTime = new Date(data.start);
            this.endTime = new Date(data.end);
            this.inquire('quick');
            this.openStatus = false;
        },
        inquire(status) {
            let platformType = {
                sort: 'payoff',
                order: 'asc'
            };

            if (status === 'bet' || status === 'valid_bet' || status === 'payoff') {
                if (this.selectDataType.platform.sort === status) {
                    platformType = {
                        ...this.selectDataType.platform,
                        order: this.selectDataType.platform.order === 'asc' ? 'desc' : 'asc'
                    };
                } else {
                    platformType = {
                        ...this.selectDataType.platform,
                        sort: status,
                        order: 'asc'
                    };
                }
            }

            mcenter.betRecord({
                params: {
                    start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                    sort: platformType.sort,
                    order: platformType.order
                },
                success: (response) => {
                    this.mainListData = [];
                    this.detailStartTime = this.startTime;
                    this.detailEndTime = this.endTime;
                    const temp = response.ret;
                    Object.keys(temp).forEach((index) => {
                        temp[index].text = gameName(temp[index].vendor, temp[index].kind);
                    });
                    if (this.type === 'all') {
                        this.mainListData = temp;
                    } else {
                        let num = 0;
                        for (let i = 0; i < temp.length; i += 1) {
                            if (this.type === temp[i].vendor) {
                                this.mainListData[num] = temp[i];
                                num += 1;
                            }
                        }
                    }
                    this.mainTotalCount = this.mainListData.length;
                    if (this.mainTotalCount === 0) {
                        this.mainNoData = true;
                        this.mainPageAll = 1;
                        return;
                    }
                    this.mainNoData = false;
                    this.mainPageAll = Math.ceil(this.mainTotalCount / this.numMax);
                    this.mainPageChange(1);
                    if (window.innerWidth < 768 && status === 'quick') {
                        const scrollSite = $(this.$refs.totalAreaWrap).outerHeight();
                        $('html, body').animate({ scrollTop: scrollSite }, 1000);
                    }

                    this.selectDataType.platform = platformType;
                }
            });
        },
        mainPageChange(page) {
            this.mainPageNow = page;
            this.mainTotal = {
                bet: 0,
                valid_bet: 0,
                payoff: 0
            };
            const max = this.mainPageNow === this.mainPageAll ? this.mainTotalCount : this.mainPageNow * this.numMax;

            for (let i = (this.mainPageNow - 1) * this.numMax; i < max; i += 1) {
                this.mainTotal.bet = this.accAdd(this.mainTotal.bet, this.mainListData[i].bet);
                this.mainTotal.valid_bet = this.accAdd(this.mainTotal.valid_bet, this.mainListData[i].valid_bet);
                this.mainTotal.payoff = this.accAdd(this.mainTotal.payoff, this.mainListData[i].payoff);
            }
            window.scrollTo(0, 0);
        },
        read(selectVendor, selectKind, action, page, status) {
            let gameItemType = {
                sort: 'payoff',
                order: 'asc'
            };

            if (status === 'bet' || status === 'valid_bet' || status === 'payoff') {
                if (this.selectDataType.gameItem.sort === status) {
                    gameItemType = {
                        ...this.selectDataType.gameItem,
                        order: this.selectDataType.gameItem.order === 'asc' ? 'desc' : 'asc'
                    };
                } else {
                    gameItemType = {
                        ...this.selectDataType.gameItem,
                        sort: status,
                        order: 'asc'
                    };
                }
            }

            if (action === 'detailPageChange') {
                this.detailPageNow = page;
                this.detailNumFirst = (this.detailPageNow - 1) * this.numMax;
            } else {
                this.detailPageNow = 1;
                this.detailNumFirst = 0;
                this.detailVendor = selectVendor;
                this.detailKind = selectKind;
            }
            Object.keys(this.gameData).forEach((index) => {
                if (selectVendor === this.gameData[index].vendor && selectKind === this.gameData[index].kind) {
                    this.detailTitle = this.gameData[index].alias;
                }
            });
            const temp = {
                start_at: Vue.moment(this.detailStartTime).format('YYYY-MM-DD 00:00:00-04:00'),
                end_at: Vue.moment(this.detailEndTime).format('YYYY-MM-DD 23:59:59-04:00'),
                vendor: selectVendor,
                kind: selectKind,
                first_result: this.detailNumFirst,
                max_results: this.numMax,
                sort: gameItemType.sort,
                order: gameItemType.order
            };
            if ((selectVendor === 'bbin' && (+(selectKind) === 1 || +(selectKind) === 4)) || (selectVendor === 'csc' && +(selectKind) === 1)) {
                temp.settled = this.settleSelect;
            }
            mcenter.betRecordDetail({
                params: temp,
                success: (response) => {
                    this.openStatus = true;
                    if (selectVendor === 'bbin' && (selectKind === 1 || selectKind === 4)) {
                        this.settleSwitch = true;
                    } else if (selectVendor === 'csc' && selectKind === 1) {
                        this.settleSwitch = true;
                    } else {
                        this.settleSwitch = false;
                    }
                    this.detailListData = [];
                    this.detailTotal = {};
                    this.detailTotalCount = response.pagination.total;
                    if (this.detailTotalCount === 0) {
                        this.detailPageAll = 1;
                        return;
                    }
                    this.detailPageAll = Math.ceil(this.detailTotalCount / this.numMax);
                    this.detailListData = response.ret;
                    this.detailTotal = response.total;
                    for (let i = 0; i < this.detailListData.length; i += 1) {
                        game.gameList({
                            params: {
                                kind: this.selectKind,
                                first_result: 0,
                                max_results: 1,
                                code: this.detailListData[i].code,
                                ignore_device: true
                            },
                            success: (data) => {
                                if (!data.ret[0]) return;
                                this.detailListData[i].text = data.ret[0].name;
                                this.detailListData = [
                                    ...this.detailListData
                                ];
                            }
                        }, this.detailVendor);
                    }
                    this.selectDataType.gameItem = gameItemType;
                }
            });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
