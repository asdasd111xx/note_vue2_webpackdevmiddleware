<template>
    <mobile-container :header-config="headerConfig" :has-footer="hasFooter">
        <div slot="content" :class="$style['content-wrap']">
            <div :class="$style['menu-wrap']">
                <div :class="$style['menu-select']" @click="selectMenu = selectMenu ? '' : 'game'">
                    <span>{{ selectType.text }}</span>
                    <span :class="$style['select-icon']" />
                </div>
                <div :class="$style['menu-select']" @click="selectMenu = selectMenu ? '' : 'time'">
                    <span>{{ selectTime }}</span>
                    <span :class="$style['select-icon']" />
                </div>
                <ul v-if="selectMenu === 'game'" :class="[$style['dropdown-wrap'], 'clearfix']">
                    <li
                        v-for="(game, index) in options"
                        :key="`${game.value}-${index}`"
                        :class="{[$style.active] : selectType.value === game.value}"
                        @click="getGameRecord(game)"
                    >
                        {{ game.text }}
                    </li>
                </ul>
                <ul v-if="selectMenu === 'time'" :class="[$style['dropdown-wrap'], 'clearfix']">
                    <li
                        v-for="(time, key) in allTotalData"
                        :key="`date-${key}`"
                        :class="{[$style.active] : selectTime === time.text}"
                        @click="getTimeRecord(key)"
                    >
                        {{ time.text }}
                    </li>
                </ul>
                <div
                    v-if="selectMenu !== ''"
                    :class="$style['dropdown-mask']"
                    @click="selectMenu = ''"
                />
            </div>
            <div v-if="!mainNoData" :class="$style['data-wrap']">
                <ul :class="[$style['total-wrap'], 'clearfix']">
                    <li :class="$style['total-count']">{{ $text('S_DATA_COUNT', '笔数') }} : 9</li>
                    <li :class="$style['total-water']">{{ $text('S_TOTAL_WATER', '流水') }} : 21.50</li>
                    <li :class="$style['total-money']">{{ $text('S_WIN_LOSE', '输赢') }} : <span :class="{[$style['is-win']] : true}">2.25</span></li>
                </ul>
                <div :class="$style['data-list']">
                    <div :class="$style['data-item']">
                        <div :class="[$style['record-count'], 'clearfix']">
                            <div :class="$style['record-count-time']">
                                03月26日
                            </div>
                            <div :class="$style['single-total-wrap']">
                                <ul :class="[$style['single-data-count'], 'clearfix']">
                                    <li :class="$style['single-count']">{{ $text('S_DATA_COUNT', '笔数') }} : 9</li>
                                    <li :class="$style['single-water']">{{ $text('S_TOTAL_WATER', '流水') }} : 21.50</li>
                                    <li :class="$style['single-money']">{{ $text('S_WIN_LOSE', '输赢') }} : <span :class="{[$style['is-win']] : true}">2.25</span></li>
                                </ul>
                            </div>
                        </div>
                        <div :class="$style['detail-wrap']">
                            <div :class="$style['detail-name']">
                                BBIN彩票
                            </div>
                            <div :class="$style['detail-game']">
                                <div :class="$style['game-name']">江西11选5</div>
                                <div :class="[$style['game-count'], 'clearfix']">
                                    <div :class="$style['game-water']">{{ $text('S_TOTAL_WATER', '流水') }} : 21.50</div>
                                    <div :class="$style['game-money']">{{ $text('S_WIN_LOSE', '输赢') }} : <span :class="{[$style['is-win']] : true}">2.25</span></div>
                                </div>
                            </div>
                        </div>
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
import { API_MCENTER_BETRECORD_TOTAL, API_MCENTER_BETRECORD_ALL } from '@/config/api';
import gameName from '@/lib/game_name';

export default {
    components: {
        mobileContainer
    },
    data() {
        return {
            hasFooter: false,
            options: [{ value: 'all', text: this.$t('S_ALL') }],
            allTotalData: {},
            selectMenu: '',
            selectType: { value: 'all', text: this.$t('S_ALL') },
            selectTime: this.$t('S_TODDAY'),
            estToday: EST(new Date(), '', true),
            startTime: '',
            endTime: '',
            mainListData: [],
            mainNoData: true
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData'
        }),
        headerConfig() {
            return {
                prev: true,
                title: this.$text('S_BETHISTORYBTN', '投注纪录'),
                onClick: () => { this.$router.back(); }
            };
        }
    },
    created() {
        this.getBetRecordTotal();
        this.getAllGameData();
        this.startTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.inquire();
    },
    methods: {
        getGameRecord(data) {
            this.selectMenu = '';
            this.selectType = data;
            this.inquire();
        },
        getTimeRecord(key) {
            this.selectTime = this.allTotalData[key].text;
            this.selectMenu = '';
        },
        getBetRecordTotal() {
            return ajax({
                method: 'get',
                url: API_MCENTER_BETRECORD_TOTAL,
                success: (response) => {
                    const temp = response.ret;
                    const textObj = {
                        today: 'S_TODDAY',
                        yesterday: 'S_YESTERDAY',
                        this_week: 'S_SEVEN_DAY',
                        this_month: 'S_THIRTY_DAY'
                    };
                    const tempData = {};

                    Object.keys(textObj).forEach((index) => {
                        tempData[index] = {
                            start_at: temp[index].start_at,
                            end_at: temp[index].end_at,
                            startShow: Vue.moment(temp[index].start_at).format('MM/DD'),
                            endShow: Vue.moment(temp[index].end_at).format('MM/DD'),
                            money: +temp[index].total !== 0 ? Number(temp[index].total).toFixed(2) : +temp[index].total,
                            text: this.$text(textObj[index])
                        };
                    });

                    this.allTotalData = tempData;
                }
            });
        },
        getAllGameData() {
            Object.keys(this.gameData).forEach((index) => {
                const { vendor } = this.gameData[index];
                if (this.gameData[index].switch === 'Y' && this.options.map((item) => item.value).indexOf(vendor) === -1) {
                    this.options.push({ value: vendor, text: gameName(vendor) });
                }
            });
        },
        inquire() {
            const params = {
                start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00')
            };

            this.startTime = Vue.moment(this.startTime).format('YYYY-MM-DD');
            this.endTime = Vue.moment(this.endTime).format('YYYY-MM-DD');

            return ajax({
                method: 'get',
                url: API_MCENTER_BETRECORD_ALL,
                params,
                success: (response) => {
                    this.mainListData = [];
                    this.inquiryStartTime = this.startTime;
                    this.inquiryEndTime = this.endTime;

                    setTimeout(() => {
                        this.messageStatus = false;
                    }, 3000);

                    if (this.selectType.value === 'all') {
                        this.mainListData = response.ret;
                    } else {
                        let num = 0;
                        for (let i = 0; i < response.ret.length; i += 1) {
                            if (this.selectType.value === response.ret[i].vendor) {
                                console.log('response.ret[i].vendor', response.ret[i].vendor);
                                this.mainListData[num] = response.ret[i];
                                num += 1;
                            }
                        }
                    }

                    if (this.mainListData.length === 0) {
                        this.mainListData = '';
                        this.mainNoData = true;
                        this.mainTotal = {
                            bet: 0,
                            valid_bet: 0,
                            payoff: 0
                        };
                        return;
                    }

                    this.mainTotal = {
                        bet: 0,
                        valid_bet: 0,
                        payoff: 0
                    };

                    for (let index = 0; index < this.mainListData.length; index += 1) {
                        this.mainTotal.bet = this.accAdd(this.mainTotal.bet, this.mainListData[index].bet);
                        this.mainTotal.valid_bet = this.accAdd(this.mainTotal.valid_bet, this.mainListData[index].valid_bet);
                        this.mainTotal.payoff = this.accAdd(this.mainTotal.payoff, this.mainListData[index].payoff);
                    }

                    this.mainNoData = false;
                }
            });
        },
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
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module />
