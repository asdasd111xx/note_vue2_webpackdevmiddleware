<template>
    <mobile-container :header-config="headerConfig" :has-footer="hasFooter">
        <div slot="content" :class="$style['content-wrap']">
            <div :class="$style['menu-wrap']">
                <div :class="$style['menu-select-game']" @click="selectMenu = selectMenu ? '' : 'game'">
                    <span>{{ selectType.alias }}</span>
                    <span :class="$style['select-icon']" />
                </div>
                <div :class="[$style['menu-select-time'], {[$style.custom] : isCustomTime}]" @click="selectMenu = selectMenu ? '' : 'time'">
                    <div v-if="isCustomTime" :class="$style['select-custom']">
                        <p>{{ selectTime.split(' ')[0] }}</p>
                        <p>{{ selectTime.split(' ')[1] }}</p>
                    </div>
                    <span v-else>{{ selectTime }}</span>
                    <span :class="$style['select-icon']" />
                </div>
                <ul v-if="selectMenu === 'game'" :class="[$style['dropdown-wrap'], 'clearfix']">
                    <li
                        v-for="(game, index) in options"
                        :key="`${game.value}-${index}`"
                        :class="{[$style.active] : selectType.vendor === game.vendor && selectType.kind === game.kind}"
                        @click="getGameRecord(game)"
                    >
                        {{ game.alias }}
                    </li>
                </ul>
                <div v-if="selectMenu === 'time'" :class="[$style['dropdown-wrap'], $style['dropdown-wrap-time'], 'clearfix']">
                    <p :class="$style['time-remind']">*{{ $text('S_SUPPORT_BETRECOED_SEARCH', '当前系统支持查询最近30日的投注记录') }}</p>
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
            <div v-if="!mainNoData" :class="$style['data-wrap']">
                <ul :class="[$style['total-wrap'], 'clearfix']">
                    <li :class="$style['total-count']">{{ $text('S_DATA_COUNT', '笔数') }} : {{ mainListData.length }}</li>
                    <li :class="$style['total-water']">{{ $text('S_TOTAL_WATER', '流水') }} : {{ parseFloat(mainTotal.valid_bet).toFixed(2) }}</li>
                    <li :class="$style['total-money']">{{ $text('S_WIN_LOSE', '输赢') }} : <span :class="{[$style['is-win']] : parseFloat(mainTotal.payoff) > 0}">{{ parseFloat(mainTotal.payoff).toFixed(2) }}</span></li>
                </ul>
                <div :class="$style['data-list']">
                    <div
                        v-for="gameTime in mainTime"
                        :key="gameTime.day"
                        :class="$style['data-item']"
                    >
                        <div :class="[$style['record-count'], 'clearfix']">
                            <div :class="$style['record-count-time']">
                                {{ getMonthDay(gameTime.day) }}
                            </div>
                            <div :class="$style['single-total-wrap']">
                                <ul :class="[$style['single-data-count'], 'clearfix']">
                                    <li :class="$style['single-count']">{{ $text('S_DATA_COUNT', '笔数') }} : {{ getCount(gameTime.day) }}</li>
                                    <li :class="$style['single-water']">{{ $text('S_TOTAL_WATER', '流水') }} : {{ gameTime.valid_bet }}</li>
                                    <li :class="$style['single-money']">{{ $text('S_WIN_LOSE', '输赢') }} : <span :class="{[$style['is-win']] : gameTime.payoff > 0}">{{ gameTime.payoff }}</span></li>
                                </ul>
                            </div>
                        </div>
                        <template v-for="(gameDetail, index) in mainListData">
                            <div
                                v-if="gameDetail.day === gameTime.day"
                                :key="`${gameDetail.vendor}-${index}`"
                                :class="$style['detail-wrap']"
                            >
                                <div :class="$style['detail-name']">
                                    {{ getVendorName(gameDetail.vendor, gameDetail.kind) }}
                                </div>
                                <div :class="$style['detail-game']">
                                    <div :class="$style['game-name']">{{ gameDetail.game_name }}</div>
                                    <div :class="[$style['game-count'], 'clearfix']">
                                        <div :class="$style['game-water']">{{ $text('S_TOTAL_WATER', '流水') }} : {{ parseFloat(gameDetail.valid_bet).toFixed(2) }}</div>
                                        <div :class="$style['game-money']">{{ $text('S_WIN_LOSE', '输赢') }} : <span :class="{[$style['is-win']] : parseFloat(gameDetail.payoff) > 0}">{{ parseFloat(gameDetail.payoff).toFixed(2) }}</span></div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div v-else :class="$style['no-data']">
                <img src="/static/image/_new/mcenter/no_data.png" />
                <p>{{ $text('S_NO_BETRECORD', '还没有任何投注记录') }}</p>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import EST from '@/lib/EST';
import mobileContainer from '../../../common/new/mobileContainer';
import ajax from '@/lib/ajax';
import datePicker from '@/router/mobile/components/common/datePicker';

export default {
    components: {
        mobileContainer,
        datePicker
    },
    data() {
        return {
            hasFooter: false,
            options: [{ vendor: 'all', alias: this.$t('S_ALL'), kind: '' }],
            selectMenu: '',
            selectType: { vendor: 'all', alias: this.$t('S_ALL'), kind: '' },
            isCustomTime: false,
            currentSelectTime: this.$t('S_TODDAY'),
            selectTime: this.$t('S_TODDAY'),
            estToday: EST(new Date(), '', true),
            limitDate: '',
            startTime: '',
            endTime: '',
            mainListData: [],
            mainTotal: {},
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
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        headerConfig() {
            return {
                prev: true,
                title: this.$text('S_BETHISTORYBTN', '投注纪录'),
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
        }
    },
    created() {
        this.options = [...this.options, ...this.memInfo.vendors];
        this.startTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.limitDate = new Date(Vue.moment(this.estToday).add(-30, 'days').format('YYYY-MM-DD'));
        this.inquire();
    },
    methods: {
        getGameRecord(data) {
            this.selectMenu = '';
            this.selectType = data;
            this.inquire();
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
            this.inquire();
        },
        inquire() {
            const params = {
                start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00')
            };

            if (this.selectType.kind) {
                params.vendor = this.selectType.vendor;
                params.kind = this.selectType.kind;
            }

            this.startTime = Vue.moment(this.startTime).format('YYYY-MM-DD');
            this.endTime = Vue.moment(this.endTime).format('YYYY-MM-DD');

            // 注單統計總資料(依投注日期)
            ajax({
                method: 'get',
                url: '/api/v1/c/stats/wager-report/by-day',
                params,
                success: (response) => {
                    if (response.ret.length === 0) {
                        this.mainTime = [];
                        return;
                    }
                    this.mainTime = response.ret.map((item) => ({
                        bet: parseFloat(item.bet).toFixed(2),
                        count: item.count,
                        day: item.day,
                        payoff: parseFloat(item.payoff).toFixed(2),
                        valid_bet: parseFloat(item.valid_bet).toFixed(2)
                    }));
                }
            });

            // 各遊戲注單統計資料(依投注日期)
            ajax({
                method: 'get',
                url: '/api/v1/c/stats/wager-report/by-day-game',
                params,
                success: (response) => {
                    if (response.ret.length === 0) {
                        this.mainListData = [];
                        this.mainNoData = true;
                        return;
                    }

                    this.mainListData = response.ret;
                    this.mainTotal = response.total;
                    this.mainNoData = false;
                }
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
            this.inquire();
        },
        getMonthDay(date) {
            return `${Vue.moment(date).format('MM-DD').replace('-', '月')}日`;
        },
        getVendorName(vendor, kind) {
            return this.memInfo.vendors.find((item) => item.vendor === vendor && item.kind === kind).alias;
        },
        getCount(date) {
            return this.mainListData.filter((item) => item.day === date).length;
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module />
