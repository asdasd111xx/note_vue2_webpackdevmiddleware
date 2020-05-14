<template>
    <div>
        <div :class="$style['menu-wrap']">
            <div :class="[$style['menu-select-game'], {[$style.active] : selectMenu === 'game'}]" @click="selectMenu = selectMenu === 'game' ? '' : 'game'">
                <span>{{ selectType.name }}</span>
            </div>
            <div :class="[$style['menu-select-time'], {[$style.custom] : isCustomTime}, {[$style.active] : selectMenu === 'time'}]" @click="selectMenu = selectMenu === 'time' ? '' : 'time'">
                <div v-if="isCustomTime" :class="$style['select-custom']">
                    <p>{{ selectTime.split(' ')[0] }}</p>
                    <p>{{ selectTime.split(' ')[1] }}</p>
                </div>
                <span v-else>{{ selectTime }}</span>
            </div>
            <ul v-if="selectMenu === 'game'" :class="[$style['dropdown-wrap'], 'clearfix']">
                <li
                    v-for="(item, index) in options"
                    :key="`options-${index}`"
                    :class="{[$style.active] : true}"
                    @click="getGameRecord(game)"
                >
                    {{ item.name }}
                </li>
            </ul>
            <div v-if="selectMenu === 'time'" :class="[$style['dropdown-wrap'], $style['dropdown-wrap-time'], 'clearfix']">
                <ul :class="[ {[$style['default-active']] : !isShowDatePicker},'clearfix']">
                    <li
                        v-for="(time, key) in allTotalData"
                        :key="`date-${key}`"
                        :class="{[$style.active] : currentSelectTime === time.text}"
                        @click="getTimeRecord(time)"
                    >
                        {{ time.text }}
                    </li>
                </ul>
                <template v-if="isShowDatePicker">
                    <div :class="$style['custom-wrap']">
                        <div :class="[$style['custom-date'], 'clearfix']" @click="currentCustomDate = currentCustomDate === 'start' ? '' : 'start'">
                            <p :class="$style['custom-title']">{{ $text('S_START_DATE', '开始日期') }}</p>
                            <p :class="$style['custom-time']">{{ startTime }}</p>
                        </div>
                        <date-picker
                            v-if="currentCustomDate === 'start'"
                            :key="`date${currentCustomDate}`"
                            :min-limit.sync="limitDate"
                            :max-limit.sync="estToday"
                            :date.sync="setStartTime"
                        />
                        <div :class="[$style['custom-date'], 'clearfix']" @click="currentCustomDate = currentCustomDate === 'end' ? '' : 'end'">
                            <p :class="$style['custom-title']">{{ $text('S_END_DATE', '结束日期') }}</p>
                            <p :class="$style['custom-time']">{{ endTime }}</p>
                        </div>
                        <date-picker
                            v-if="currentCustomDate === 'end'"
                            :key="`date${currentCustomDate}`"
                            :min-limit.sync="limitDate"
                            :max-limit.sync="estToday"
                            :date.sync="setEndTime"
                        />
                    </div>
                    <div :class="[$style['time-button-group'], 'clearfix']">
                        <div :class="$style['time-cancel']" @click="cancelCustomTime">{{ $text('S_CANCEL', '取消') }}</div>
                        <div :class="$style['time-confirm']" @click="setCustomTime">{{ $text('S_CONFIRM', '确认') }}</div>
                    </div>
                </template>
            </div>
            <div
                v-if="selectMenu !== ''"
                :class="$style['dropdown-mask']"
                @click="selectMenu = ''"
            />
        </div>
        <template v-if="true">
            <div :class="$style['total-wrap']">
                <div>首存金额: {{ mainTotal.amount }}</div>
                <div>礼金: 13443</div>
            </div>
            <div :class="$style['info-list']">
                <div
                    v-for="info in mainListData"
                    :key="info.upper_id"
                    :class="$style['info-item']"
                >
                    <div :class="$style['item-header']">
                        <div :class="$style['friend-name']">
                            {{ info.username }}
                        </div>
                        <div>
                            礼金: {{ info.total_invite_gift }}
                        </div>
                    </div>
                    <div :class="$style['item-content']">
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                注册时间
                            </div>
                            <div :class="$style['item-detail-result']">
                                {{ info.user_created_at }}
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                首存金额
                            </div>
                            <div :class="$style['item-detail-result']">
                                {{ info.amount }}
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                推荐礼金
                            </div>
                            <div :class="$style['item-detail-result']">
                                {{ info.deposit_gift }}
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                推荐人奖励
                            </div>
                            <div :class="$style['item-detail-result']">
                                {{ info.invite_gift }}
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                审核状态
                            </div>
                            <div :class="$style['item-detail-result']">
                                已派发
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="$style['info-item']">
                    <div :class="$style['item-header']">
                        <div :class="$style['friend-name']">
                            sann
                        </div>
                        <div>
                            礼金: 6344
                        </div>
                    </div>
                    <div :class="$style['item-content']">
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                注册时间
                            </div>
                            <div :class="$style['item-detail-result']">
                                2020-03-30 01:00:56
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                首存金额
                            </div>
                            <div :class="$style['item-detail-result']">
                                45555
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                推荐礼金
                            </div>
                            <div :class="$style['item-detail-result']">
                                88.99
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                审核状态
                            </div>
                            <div :class="$style['item-detail-result']">
                                已派发
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="$style['info-item']">
                    <div :class="$style['item-header']">
                        <div :class="$style['friend-name']">
                            sann
                        </div>
                        <div>
                            礼金: 6344
                        </div>
                    </div>
                    <div :class="$style['item-content']">
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                注册时间
                            </div>
                            <div :class="$style['item-detail-result']">
                                2020-03-30 01:00:56
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                首存金额
                            </div>
                            <div :class="$style['item-detail-result']">
                                45555
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                推荐礼金
                            </div>
                            <div :class="$style['item-detail-result']">
                                88.99
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                审核状态
                            </div>
                            <div :class="$style['item-detail-result']">
                                已派发
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="$style['info-item']">
                    <div :class="$style['item-header']">
                        <div :class="$style['friend-name']">
                            sann
                        </div>
                        <div>
                            礼金: 6344
                        </div>
                    </div>
                    <div :class="$style['item-content']">
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                注册时间
                            </div>
                            <div :class="$style['item-detail-result']">
                                2020-03-30 01:00:56
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                首存金额
                            </div>
                            <div :class="$style['item-detail-result']">
                                45555
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                推荐礼金
                            </div>
                            <div :class="$style['item-detail-result']">
                                88.99
                            </div>
                        </div>
                        <div :class="$style['item-detail']">
                            <div :class="$style['item-detail-title']">
                                审核状态
                            </div>
                            <div :class="$style['item-detail-result']">
                                已派发
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <div v-else :class="$style['no-data-wrap']">
            <img :src="$getCdnPath('/static/image/_new/mcenter/moneyDetail/no_data.png')" />
            <div :class="$style.tips">还没有任何记录</div>
            <div :class="$style['btn-money']" @click="$router.push('/mobile/mcenter/deposit')">推广赚钱</div>
        </div>
        <infinite-loading
            v-if="showInfinite"
            ref="infiniteLoading"
            @infinite="infiniteHandler"
        >
            <span slot="no-more" />
            <span slot="no-results" />
        </infinite-loading>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';
import EST from '@/lib/EST';
import ajax from '@/lib/ajax';
import datePicker from '@/router/mobile/components/common/datePicker';

export default {
    components: {
        datePicker,
        InfiniteLoading
    },
    data() {
        return {
            hasFooter: false,
            options: [
                {
                    name: '全部',
                    key: 'all'
                },
                {
                    name: '已派发',
                    key: 'dispatch'
                },
                {
                    name: '已撤销',
                    key: 'revoked'
                },
                {
                    name: '资格不符',
                    key: 'allow'
                }
            ],
            selectMenu: '',
            selectType: { name: '全部' },
            isCustomTime: false,
            currentSelectTime: this.$t('S_TODDAY'),
            selectTime: this.$t('S_TODDAY'),
            estToday: EST(new Date(), '', true),
            limitDate: '',
            startTime: '',
            endTime: '',
            mainListData: [
                {
                    id: '1',
                    upper_id: '3',
                    user_id: '4',
                    user_created_at: '2020-03-01 19:32:00',
                    amount: '210.00',
                    deposit_gift: '12.00',
                    invite_gift: '122.00',
                    total_invite_gift: '234.00',
                    status: '1',
                    allow: true,
                    canceled: false,
                    dispatch: true,
                    revoked: false,
                    username: 'player0'
                },
                {
                    id: '1',
                    upper_id: '3',
                    user_id: '4',
                    user_created_at: '2020-04-02 00:22:00',
                    amount: '90.00',
                    deposit_gift: '22.00',
                    invite_gift: '152.00',
                    total_invite_gift: '1134.00',
                    status: '1',
                    allow: true,
                    canceled: false,
                    dispatch: true,
                    revoked: false,
                    username: 'jack'
                },
                {
                    id: '1',
                    upper_id: '3',
                    user_id: '4',
                    user_created_at: '2020-04-22 13:32:00',
                    amount: '1111.00',
                    deposit_gift: '32.00',
                    invite_gift: '8.00',
                    total_invite_gift: '334.00',
                    status: '1',
                    allow: true,
                    canceled: false,
                    dispatch: true,
                    revoked: false,
                    username: 'mina'
                }
            ],
            mainTotal: {
                amount: '100.00',
                deposit_gift: '122.00',
                invite_gift: '12.00',
                total_invite_gift: '134.00'
            },
            mainTime: [],
            mainNoData: true,
            currentCustomDate: '',
            isShowDatePicker: false,
            allTotalData: [
                {
                    text: this.$text('S_TODDAY', '今日'),
                    name: 'today',
                    value: 0
                },
                {
                    text: this.$text('S_YESTERDAY', '昨日'),
                    name: 'yesterday',
                    value: 1
                },
                {
                    text: this.$text('S_SEVEN_DAY', '近7日'),
                    name: 'week',
                    value: 7
                },
                {
                    text: this.$text('S_THIRTY_DAY', '近30日'),
                    name: 'month',
                    value: 30
                },
                {
                    text: this.$text('S_CUSTOM_DATE', '自定义'),
                    name: 'custom',
                    value: 30
                }
            ],
            pagination: {},
            isLoading: false,
            isReceive: false,
            showInfinite: false,
            maxResults: 10, // 一頁顯示幾筆
            showPage: 0 // 顯示幾頁
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            gameData: 'getGameData'
        }),
        headerConfig() {
            return {
                prev: true,
                title: this.$text('S_BETHISTORYBTN', '投注记录'),
                onClick: () => { this.$router.back(); }
            };
        },
        setStartTime: {
            get() {
                return new Date(this.startTime);
            },
            set(value) {
                this.startTime = Vue.moment(value).format('YYYY-MM-DD');
            }
        },
        setEndTime: {
            get() {
                return new Date(this.endTime);
            },
            set(value) {
                this.endTime = Vue.moment(value).format('YYYY-MM-DD');
            }
        },
        controlData() {
            return this.mainTime.map((item) => ({
                ...item,
                list: this.mainListData.filter((game) => game.day === item.day)
            })).filter((data) => data.list.length > 0);
        },
        showData() {
            if (this.mainData.length === 0) {
                return false;
            }
            return this.mainData.some((item) => this.controlData.some((data) => item.day === data.day));
        }
    },
    created() {
        this.startTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.limitDate = new Date(Vue.moment(this.estToday).add(-30, 'days').format('YYYY-MM-DD'));
        this.isLoading = true;
        this.updateGame();
    },
    methods: {
        getGameRecord(data) {
            this.selectMenu = '';
            this.selectType = data;
            this.showPage = 0;
            this.mainTotal = {};
            this.pagination = {};
            this.mainListData = [];
            this.mainTime = [];
            this.isLoading = true;
            this.updateGame();
        },
        getTimeRecord(data) {
            this.currentSelectTime = data.text;

            this.startTime = Vue.moment(this.estToday).add(-data.value, 'days').format('YYYY-MM-DD');
            this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');

            if (data.name === 'yesterday') {
                this.endTime = Vue.moment(this.estToday).add(-data.value, 'days').format('YYYY-MM-DD');
            }

            if (data.name === 'custom') {
                this.isShowDatePicker = true;
                return;
            }

            this.selectTime = data.text;
            this.isShowDatePicker = false;
            this.isCustomTime = false;
            this.selectMenu = '';
            this.showPage = 0;
            this.pagination = {};
            this.mainTotal = {};
            this.mainListData = [];
            this.mainTime = [];
            this.isLoading = true;
            this.updateGame();
        },
        // getTotalTime() {
        //     const params = {
        //         start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
        //         end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00')
        //     };

        //     if (this.selectType.kind) {
        //         params.vendor = this.selectType.vendor;
        //         params.kind = this.selectType.kind;
        //     }

        //     // 注單統計總資料(依投注日期)
        //     return ajax({
        //         method: 'get',
        //         url: '/api/v1/c/stats/wager-report/by-day',
        //         params,
        //         success: (response) => {
        //             this.mainTime = response.ret.map((item) => ({
        //                 bet: parseFloat(item.bet).toFixed(2),
        //                 count: item.count,
        //                 day: item.day,
        //                 payoff: parseFloat(item.payoff).toFixed(2),
        //                 valid_bet: parseFloat(item.valid_bet).toFixed(2),
        //                 list: []
        //             }));
        //             this.updateGame();
        //         }
        //     });
        // },
        getGameDetail() {
            const params = {
                start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                max_results: this.maxResults,
                first_result: this.maxResults * this.showPage
            };

            this.startTime = Vue.moment(this.startTime).format('YYYY-MM-DD');
            this.endTime = Vue.moment(this.endTime).format('YYYY-MM-DD');

            // 各遊戲注單統計資料(依投注日期)
            return ajax({
                method: 'get',
                url: '/api/v1/c/festival/entry/list',
                params,
                success: (response) => {
                    if (response.ret.length === 0) {
                        return;
                    }

                    this.mainListData.push(...response.ret);
                    this.mainTotal = response.total;
                    this.pagination = response.pagination;
                    this.mainNoData = false;
                }
            });
        },
        updateGame() {
            this.showInfinite = false;

            this.mainNoData = true;

            this.$nextTick(() => {
                this.showInfinite = true;
            });
        },
        cancelCustomTime() {
            if (this.allTotalData.some((item) => item.text === this.selectTime)) {
                this.currentSelectTime = this.selectTime;
                this.isShowDatePicker = false;
            }

            this.selectMenu = '';
        },
        setCustomTime() {
            this.startTime = Vue.moment(this.setStartTime).format('YYYY-MM-DD');
            this.endTime = Vue.moment(this.setEndTime).format('YYYY-MM-DD');
            this.selectTime = `${this.startTime} ${this.endTime}`;
            this.isCustomTime = true;
            this.currentCustomDate = '';
            this.selectMenu = '';
            this.getTotalTime();
        },
        getMonthDay(date) {
            return `${Vue.moment(date).format('MM-DD').replace('-', '月')}日`;
        },
        getVendorName(vendor, kind) {
            if (!this.memInfo.vendors.find((item) => item.vendor === vendor && item.kind === kind)) {
                return this.$t(Object.keys(this.gameData).map((key) => {
                    if (this.gameData[key].vendor === vendor) {
                        return this.gameData[key].text;
                    }

                    return '';
                }).join(''));
            }
            return this.memInfo.vendors.find((item) => item.vendor === vendor && item.kind === kind).alias;
        },
        getCount(date) {
            return this.mainListData.filter((item) => item.day === date).length;
        },
        /**
         * 捲動加載
         * @param {object} $state - 套件提供的方法
         * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
         */
        infiniteHandler($state) {
            if (this.isReceive) {
                return;
            }

            this.isReceive = true;
            this.getGameDetail().then(({ result }) => {
                this.isLoading = false;
                this.isReceive = false;
                if (result !== 'ok') {
                    return;
                }

                if (!this.pagination.total || this.mainListData.length === +this.pagination.total) {
                    $state.complete();
                    return;
                }

                this.showPage += 1;

                $state.loaded();
            });
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module />
