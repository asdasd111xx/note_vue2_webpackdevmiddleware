<template>
    <div class="game-record">
        <div class="main-title clearfix">
            <span v-if="currentType === 'main'">{{ $t('S_MEM_GAME_RECORD') }}</span>
            <span
                v-else
                class="title pointer"
                @click="currentType = 'main'"
            >{{ $t('S_MEM_GAME_RECORD') }}</span>
            <template v-if="currentType === 'second'">
                <span class="text"><span class="arrow">></span>{{ selectUser }}</span>
                <div class="main-btn" @click="currentType = 'main'">{{ $t('S_BACK_PAGE') }}</div>
            </template>
            <template v-if="currentType === 'detail'">
                <span class="text pointer" @click="currentType = 'second'"><span class="arrow">></span>
                    {{ selectUser }}</span>
                <span class="text"><span class="arrow">></span>{{ getGameName(selectVendor, selectKind) }}</span>
                <div class="main-btn" @click="currentType = 'second'">{{ $t('S_BACK_PAGE') }}</div>
            </template>
        </div>
        <div v-if="settleSwitch" class="settle-wrap clearfix">
            <div class="main-radio">
                <input
                    id="record-yet"
                    v-model="selectSettle"
                    type="radio"
                    name="promotion-class"
                    value="false"
                    @click="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], '')"
                />{{ $t('S_UNCOMPUTE_STR') }}
                <label for="record-yet">
                    <span class="radio-style" />
                </label>
            </div>
            <div class="main-radio">
                <input
                    id="record-already"
                    v-model="selectSettle"
                    type="radio"
                    name="promotion-class"
                    value="true"
                    @click="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], '')"
                />{{ $t('S_COMPUTED_STR') }}
                <label for="record-already">
                    <span class="radio-style" />
                </label>
            </div>
        </div>
        <div v-if="currentType === 'main'" class="game-record-field clearfix">
            <div class="select-list">
                <model-select
                    v-model="inputVendor"
                    :options="vendorList"
                    :placeholder="$t('S_ALL')"
                />
            </div>
            <div class="main-calendar-wrap clearfix">
                <span :title="$t('S_WAGER_TIME')" class="date-text">{{ $t('S_WAGER_TIME') }}</span>
                <datePicker
                    v-model="startTime"
                    value-type="YYYY-MM-DD"
                    :disabled-date="notBeforeSixtyDay"
                    class="main-calendar left"
                    input-class="main-input"
                    :clearable="false"
                    :editable="false"
                    @change="changeTime"
                />
                <span class="date-line">-</span>
                <datePicker
                    v-model="endTime"
                    value-type="YYYY-MM-DD"
                    :disabled-date="notBeforeStartDay"
                    class="main-calendar right"
                    input-class="main-input"
                    :clearable="false"
                    :editable="false"
                    @change="changeTime"
                />
            </div>
            <input
                v-model="inputUser"
                :placeholder="$t('S_USER_NAME')"
                class="main-input username"
                type="text"
            />
            <div class="main-btn inquire-btn" @click="inquire('main', '', '', '', 1, 'reset')">{{ $t('S_INQUIRE') }}</div>
        </div>
        <template v-if="mainNoData" />
        <template v-else>
            <div class="pad-sort-wrap clearfix">
                <select
                    v-model="selectSort[currentType]"
                    class="main-input select-sort"
                    @change="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], '')"
                >
                    <option value="bet">{{ $t('S_WAGER_AMOUNT') }}</option>
                    <option value="valid_bet">{{ $t('S_VALID_BET') }}</option>
                    <option value="payoff">{{ $t('S_PAY_OUT') }}</option>
                </select>
                <div :class="`sort-btn big ${sort[currentType] === 'desc' ? 'current' : ''}`" @click="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], selectSort[currentType])" />
                <div :class="`sort-btn small ${sort[currentType] === 'asc' ? 'current' : ''}`" @click="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], selectSort[currentType])" />
            </div>
            <template v-for="(typePage, tableIndex) in allType">
                <table
                    v-if="currentType === typePage"
                    :key="tableIndex"
                    :class="`main-table ${typePage}`"
                >
                    <thead class="agcenter-pc">
                        <tr>
                            <th class="number">{{ $t('S_NUMBER_NO') }}</th>
                            <th v-if="currentType === 'main'" class="username">{{ $t('S_USER_NAME') }}</th>
                            <th v-else-if="currentType === 'second'" class="platform">{{ $t('S_PLATFORM') }}</th>
                            <th v-else-if="currentType === 'detail'" class="gametype">{{ $t('S_GAMETYPE2') }}</th>
                            <th v-if="currentType === 'detail'" class="quantity">{{ $t('S_MA_NUM_BETS') }}</th>
                            <th :class="`amount ${selectSort[currentType] === 'bet' ? 'active' : ''}`" @click="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], 'bet')">
                                {{ $t('S_WAGER_AMOUNT') }}
                                <icon
                                    v-if="selectSort[currentType] === 'bet'"
                                    :name="`${sort[currentType] === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                            <th :class="`valid ${selectSort[currentType] === 'valid_bet' ? 'active' : ''}`" @click="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], 'valid_bet')">
                                {{ $t('S_VALID_BET') }}
                                <icon
                                    v-if="selectSort[currentType] === 'valid_bet'"
                                    :name="`${sort[currentType] === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                            <th :class="`result ${selectSort[currentType] === 'payoff' ? 'active' : ''}`" @click="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], 'payoff')">
                                {{ $t('S_PAY_OUT') }}
                                <icon
                                    v-if="selectSort[currentType] === 'payoff'"
                                    :name="`${sort[currentType] === 'desc' ? 'caret-down' : 'caret-up'}`"
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
                            <th v-if="currentType !== 'detail'" class="view-next">{{ $t('S_OPERATE') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(list, index) in allData[currentType]">
                            <tr :key="index" class="agcenter-pc">
                                <td class="number">{{ index + 1 }}</td>
                                <td v-if="currentType === 'main'" class="username">{{ list.username }}</td>
                                <td v-else-if="currentType === 'second'" class="platform">{{ getGameName(list.vendor_name, list.kind) }}</td>
                                <td v-else-if="currentType === 'detail'" class="gametype">{{ list.text }}</td>
                                <th v-if="currentType === 'detail'" class="quantity">{{ list.counts }}</th>
                                <td class="amount">{{ list.bet }}</td>
                                <td class="valid">{{ list.valid_bet }}</td>
                                <td :class="`result ${+(list.payoff) < 0 ? 'negative' : ''}`">{{ list.payoff }}</td>
                                <td v-if="currentType !== 'detail'" class="view-next">
                                    <span @click="currentType === 'main' ? inquire('second', list.username, inputVendor, '', 1, '') : inquire('detail', selectUser, list.vendor_name, list.kind, 1, '')">
                                        <icon class="search-icon" name="search" />
                                    </span>
                                </td>
                            </tr>
                            <table :key="index" class="pad">
                                <tr class="number">
                                    <td colspan="2">{{ index + 1 }}</td>
                                </tr>
                                <tr v-if="currentType === 'main'">
                                    <td class="username caption">{{ $t('S_USER_NAME') }}</td>
                                    <td class="username content">{{ list.username }}</td>
                                </tr>
                                <tr v-else-if="currentType === 'second'">
                                    <td class="platform caption">{{ $t('S_PLATFORM') }}</td>
                                    <td class="platform content">{{ getGameName(list.vendor_name, list.kind) }}</td>
                                </tr>
                                <tr v-else-if="currentType === 'detail'">
                                    <td class="gametype caption">{{ $t('S_GAMETYPE2') }}</td>
                                    <td class="gametype content">{{ list.text }}</td>
                                </tr>
                                <tr v-if="currentType === 'detail'">
                                    <td class="quantity caption">{{ $t('S_MA_NUM_BETS') }}</td>
                                    <td class="quantity content">{{ list.counts }}</td>
                                </tr>
                                <tr>
                                    <td class="amount caption">{{ $t('S_WAGER_AMOUNT') }}</td>
                                    <td class="amount content">{{ list.bet }}</td>
                                </tr>
                                <tr>
                                    <td class="valid  caption">{{ $t('S_VALID_BET') }}</td>
                                    <td class="valid content">{{ list.valid_bet }}</td>
                                </tr>
                                <tr>
                                    <td class="result caption">{{ $t('S_PAY_OUT') }}</td>
                                    <td :class="`result ${+(list.payoff) < 0 ? 'negative' : ''} content`">{{ list.payoff }}</td>
                                </tr>
                                <tr v-if="currentType !== 'detail'">
                                    <td class="view-next caption">{{ $t('S_OPERATE') }}</td>
                                    <td class="view-next content">
                                        <span @click="currentType === 'main' ? inquire('second', list.username, inputVendor, '', 1, '') : inquire('detail', selectUser, list.vendor_name, list.kind, 1, '')">
                                            <icon class="search-icon" name="search" />
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <tr class="sub-total agcenter-pc">
                            <td :colspan="currentType === 'detail' ? 3 : 2" class="title">{{ currentType === 'main' ? $t('S_PAGE_RESULT_SUM') : $t('S_RESULT_SUM') }}</td>
                            <td class="amount">{{ subTotalData[currentType].bet }}</td>
                            <td class="valid">{{ subTotalData[currentType].valid_bet }}</td>
                            <td :class="`result ${+(subTotalData[currentType].payoff) < 0 ? 'negative' : ''}`">{{ subTotalData[currentType].payoff }}</td>
                            <td v-if="currentType !== 'detail'" class="view-next" />
                        </tr>
                        <table class="pad">
                            <tr class="sub-total title">
                                <td colspan="2" class="title">{{ currentType === 'main' ? $t('S_PAGE_RESULT_SUM') : $t('S_RESULT_SUM') }}</td>
                            </tr>
                            <tr>
                                <td class="amount caption">{{ $t('S_WAGER_AMOUNT') }}</td>
                                <td class="amount content">{{ subTotalData[currentType].bet }}</td>
                            </tr>
                            <tr>
                                <td class="valid caption">{{ $t('S_VALID_BET') }}</td>
                                <td class="valid content">{{ subTotalData[currentType].valid_bet }}</td>
                            </tr>
                            <tr>
                                <td class="result caption">{{ $t('S_PAY_OUT') }}</td>
                                <td :class="`result ${+(subTotalData[currentType].payoff) < 0 ? 'negative' : ''} content`">{{ subTotalData[currentType].payoff }}</td>
                            </tr>
                        </table>
                        <tr v-if="currentType === 'main'" class="main-total agcenter-pc">
                            <td class="title" colspan="2">{{ $t('S_SEARCH_RESULT_SUM') }}</td>
                            <td class="amount">{{ mainTotalData.bet }}</td>
                            <td class="valid">{{ mainTotalData.valid_bet }}</td>
                            <td :class="`result ${+(mainTotalData.payoff) < 0 ? 'negative' : ''}`">{{ mainTotalData.payoff }}</td>
                            <td class="view-next" />
                        </tr>
                        <table v-if="currentType === 'main'" class="pad">
                            <tr class="main-total title">
                                <td colspan="2">{{ $t('S_SEARCH_RESULT_SUM') }}</td>
                            </tr>
                            <tr>
                                <td class="amount caption">{{ $t('S_WAGER_AMOUNT') }}</td>
                                <td class="amount content">{{ mainTotalData.bet }}</td>
                            </tr>
                            <tr>
                                <td class="valid caption">{{ $t('S_VALID_BET') }}</td>
                                <td class="valid content">{{ mainTotalData.valid_bet }}</td>
                            </tr>
                            <tr>
                                <td class="result caption">{{ $t('S_PAY_OUT') }}</td>
                                <td :class="`result ${+(mainTotalData.payoff) < 0 ? 'negative' : ''} content`">{{ mainTotalData.payoff }}</td>
                            </tr>
                        </table>
                    </tbody>
                </table>
            </template>
            <div class="page-wrap">
                <span :class="`page-first${currentPage[currentType] === 1 ? ' disable' : ''}`" @click="currentPage[currentType] === 1 ? '' : inquire(currentType, selectUser, selectVendor, selectKind, 1, '')" />
                <span :class="`page-pre${currentPage[currentType] === 1 ? ' disable' : ''}`" @click="currentPage[currentType] === 1 ? '' : inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType] - 1, '')" />
                <div class="page-select-wrap">
                    <select
                        v-model="currentPage[currentType]"
                        class="page-select"
                        @change="inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType], '')"
                    >
                        <option
                            v-for="(num, index) in allPage[currentType]"
                            :key="index"
                            :value="num"
                        >
                            {{ num }}
                        </option>
                    </select>
                    <span class="page-total">/&nbsp;{{ allPage[currentType] }}</span>
                </div>
                <span :class="`page-next${currentPage[currentType] === allPage[currentType] ? ' disable' : ''}`" @click="currentPage[currentType] === allPage[currentType] ? '' : inquire(currentType, selectUser, selectVendor, selectKind, currentPage[currentType] + 1, '')" />
                <span :class="`page-last${currentPage[currentType] === allPage[currentType] ? ' disable' : ''}`" @click="currentPage[currentType] === allPage[currentType] ? '' : inquire(currentType, selectUser, selectVendor, selectKind, allPage[currentType], '')" />
            </div>
        </template>
    </div>
</template>

<script>
import { format, add } from 'date-fns';
import { mapGetters } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import DatePicker from 'vue2-datepicker';
import agcenter from '@/api/agcenter';
import game from '@/api/game';
import gameName from '@/lib/game_name';

export default {
    components: {
        ModelSelect,
        DatePicker
    },
    data() {
        const estTodayDate = new Date().getTime() + ((new Date().getTimezoneOffset() / 60) * 3600000) - 14400000;
        const estToday = format(estTodayDate, 'yyyy-MM-dd');
        const startTime = format(add(estTodayDate, { days: -6 }), 'yyyy-MM-dd');
        const endTime = estToday;
        const limitDays = format(add(estTodayDate, { days: -59 }), 'yyyy-MM-dd');

        return {
            estToday,
            startTime,
            endTime,
            limitDays,
            allType: ['main', 'second', 'detail'],
            currentType: 'main',
            inputVendor: '',
            inputUser: '',
            selectUser: '',
            selectVendor: '',
            selectKind: '',
            selectSettle: true,
            numMax: 10, // 每頁顯示幾筆
            allData: {
                main: [],
                second: [],
                detail: []
            },
            totalNum: {
                main: 0,
                second: 0,
                detail: 0
            },
            subTotalData: {
                main: {
                    bet: 0,
                    valid_bet: 0,
                    payoff: 0
                },
                second: {
                    bet: 0,
                    valid_bet: 0,
                    payoff: 0
                },
                detail: {
                    bet: 0,
                    valid_bet: 0,
                    payoff: 0
                }
            },
            startNo: {
                main: 0,
                second: 0,
                detail: 0
            },
            allPage: {
                main: 1,
                second: 1,
                detail: 1
            },
            currentPage: {
                main: 1,
                second: 1,
                detail: 1
            },
            selectSort: {
                main: 'payoff',
                second: 'payoff',
                detail: 'payoff'
            },
            sort: {
                main: 'asc',
                second: 'asc',
                detail: 'asc'
            },
            mainTotalData: {},
            mainNoData: true,
            detailStartTime: '',
            detailEndTime: ''
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData',
            agentInfo: 'getAgentInfo'
        }),
        settleSwitch() {
            const isCustomizedBall = this.selectVendor === 'csc' && this.selectKind === 1;
            const isBbinType = this.selectVendor === 'bbin' && (+(this.selectKind) === 1 || +(this.selectKind) === 4);

            return this.currentType === 'detail' && (isCustomizedBall || isBbinType);
        },
        vendorList() {
            const games = Object.keys(this.gameData).reduce((init, key) => [
                ...init,
                {
                    value: `${this.gameData[key].vendor}-${this.gameData[key].kind}`,
                    text: this.gameData[key].alias
                }
            ], []);

            return [
                { value: '', text: this.$text('S_ALL') },
                ...games
            ];
        },
        currentSelect() {
            return {
                vendor: this.inputVendor.split('-')[0] || '',
                kind: this.inputVendor.split('-')[1] || ''
            };
        }
    },
    created() {
        if (!this.agentInfo.user.show_promotion) {
            if (this.$route.path.split('/')[1] === 'mobile') {
                this.$router.push('/mobile/agcenter/home');
                return;
            }
            this.$router.push('/agent/accountData');
        }
    },
    methods: {
        notBeforeSixtyDay(date) {
            const dates = format(date, 'yyyy-MM-dd');
            return dates < this.limitDays || dates > this.estToday;
        },
        notBeforeStartDay(date) {
            const dates = format(date, 'yyyy-MM-dd');
            return dates < this.startTime || dates > this.estToday;
        },
        changeTime() {
            if (this.startTime < this.endTime) {
                return;
            }
            this.endTime = this.startTime;
        },
        getGameName(vendor, kind) {
            return gameName(vendor, kind);
        },
        inquire(type, secondUser, detailVendor, detailKind, pageChange, action) {
            if (action === 'bet' || action === 'valid_bet' || action === 'payoff') {
                if (this.selectSort[type] === action) {
                    this.sort[type] = this.sort[type] === 'asc' ? 'desc' : 'asc';
                } else {
                    this.selectSort[type] = action;
                    this.sort[type] = 'asc';
                }
            }
            if (action === 'reset') {
                for (let i = 0; i < this.allType.length; i += 1) {
                    const nowType = this.allType[i];
                    this.selectUser = '';
                    this.selectSettle = true;
                    this.allData[nowType] = [];
                    this.totalNum[nowType] = 0;
                    this.subTotalData[nowType] = {
                        bet: 0,
                        valid_bet: 0,
                        payoff: 0
                    };
                    this.startNo[nowType] = 0;
                    this.allPage[nowType] = 1;
                    this.currentPage[nowType] = 1;
                    this.selectSort[nowType] = 'payoff';
                    this.sort[nowType] = 'asc';
                }
                window.scrollTo(0, 0);
            }
            this.subTotalData[type] = {
                bet: 0,
                valid_bet: 0,
                payoff: 0
            };
            this.currentPage[type] = pageChange;
            this.startNo[type] = (this.currentPage[type] - 1) * this.numMax;

            if (type === 'main') {
                agcenter.gameRecord({
                    params: {
                        username: this.inputUser,
                        start_at: `${this.startTime} 00:00:00-04:00`,
                        end_at: `${this.endTime} 23:59:59-04:00`,
                        vendor: this.currentSelect.vendor,
                        kind: this.currentSelect.kind,
                        sort: this.selectSort[type],
                        order: this.sort[type],
                        first_result: this.startNo[type],
                        max_results: this.numMax
                    },
                    success: (response) => {
                        this.detailStartTime = this.startTime;
                        this.detailEndTime = this.endTime;
                        this.mainTotalData = response.total;
                        this.inquireDataSet(type, response);
                        window.scrollTo(0, 0);
                    }
                });
            }
            if (type === 'second') {
                // 給第三層用
                this.selectUser = secondUser;

                agcenter.gameRecordMember({
                    params: {
                        username: secondUser,
                        start_at: `${this.detailStartTime} 00:00:00-04:00`,
                        end_at: `${this.detailEndTime} 23:59:59-04:00`,
                        vendor: this.currentSelect.vendor,
                        kind: this.currentSelect.kind,
                        sort: this.selectSort[type],
                        order: this.sort[type],
                        first_result: this.startNo[type],
                        max_results: this.numMax
                    },
                    success: (response) => {
                        this.inquireDataSet(type, response);
                        window.scrollTo(0, 0);
                    }
                });
            }
            if (type === 'detail') {
                this.selectVendor = detailVendor;
                this.selectKind = detailKind;

                const temp = {
                    username: this.selectUser,
                    start_at: `${this.detailStartTime} 00:00:00-04:00`,
                    end_at: `${this.detailEndTime} 23:59:59-04:00`,
                    vendor: detailVendor,
                    kind: detailKind,
                    sort: this.selectSort[type],
                    order: this.sort[type],
                    first_result: this.startNo[type],
                    max_results: this.numMax
                };

                if ((detailVendor === 'bbin' && (+(detailKind) === 1 || +(detailKind) === 4)) || (detailVendor === 'csc' && +(detailKind) === 1)) {
                    temp.settled = this.selectSettle;
                }

                agcenter.gameRecordDetail({
                    params: temp,
                    success: (response) => {
                        this.inquireDataSet(type, response);
                        window.scrollTo(0, 0);
                    }
                });
            }
        },
        inquireDataSet(type, callBack) {
            this.currentType = type;
            if (callBack.ret.length === 0) {
                this.allData[type] = [];
                if (type === 'main') {
                    this.mainTotalData = {};
                    this.mainNoData = true;
                    alert(this.$t('S_NO_DATA_TPL'));
                }
                return;
            }
            this.mainNoData = false;
            this.totalNum[type] = callBack.pagination.total;
            this.allPage[type] = Math.ceil(this.totalNum[type] / this.numMax);

            // 第一層
            if (type === 'main') {
                this.allData[type] = callBack.ret;
                this.mainTotalData = callBack.total;
                this.subTotalData[type] = callBack.sub_total;
                return;
            }

            // 第二層
            if (type === 'second') {
                this.allData[type] = callBack.ret;
                this.subTotalData[type] = callBack.total;
                return;
            }

            // 第三層做遊戲名稱處理
            const tempArr = callBack.ret;
            if (type === 'detail') {
                for (let i = 0; i < tempArr.length; i += 1) {
                    game.gameList({
                        params: {
                            kind: this.selectKind,
                            first_result: 0,
                            max_results: 1,
                            code: tempArr[i].code,
                            ignore_device: true
                        },
                        success: (response) => {
                            if (!response.ret[0]) return;
                            tempArr[i].text = response.ret[0].name;
                            this.allData[type] = tempArr;
                            this.allData[type] = [
                                ...this.allData[type]
                            ];
                        }
                    }, this.selectVendor);
                }
                this.allData[type] = tempArr;
                this.subTotalData[type] = callBack.total;
            }
        }
    }
};
</script>

<style src="../css/index.scss" lang="scss" scoped />
