<template>
    <div :class="[$style['bet-record-wrap'], colorClass]">
        <template v-if="!detailAlias">
            <div :class="$style['total-top-wrap']">
                <swiper :options="categoryOptions" :class="$style['total-list']">
                    <swiper-slide
                        v-for="(item, key) in dateTypeList"
                        :key="`total-data-${key}`"
                        :class="$style['total-item']"
                    >
                        <div @click="getTypeData(key)">
                            <div :class="[$style['total-item-date'], { [$style['is-current']]: dateState === key }]">{{ $text(item.text) }}</div>
                        </div>
                    </swiper-slide>
                </swiper>
                <div :class="$style['expend-btn']" @click="showAllDate = !showAllDate">
                    <img :src="$getCdnPath('/static/image/mobile/mcenter/ic_arrow_d.png')" />
                </div>
            </div>
            <div v-if="showAllDate" :class="$style['date-expand-wrap']">
                <div :class="$style['date-mask']" />
                <div :class="$style['date-content']">
                    <div
                        v-for="(item, key) in dateTypeList"
                        :key="`date-${key}`"
                        :class="[$style['date-item'], { [$style['is-active']]: dateState === key }]"
                        @click="getTypeData(key)"
                    >
                        {{ $text(item.text) }}
                    </div>
                </div>
            </div>
            <div v-if="showBetBar && dateState !== 'search'" :class="$style['bet-header']">
                <div :class="$style['bet-header-left']">{{ dateState === 'overview' ? $text('S_VALID_BET', '有效投注') : $text('S_PAY_OUT_TOTAL', '派彩总计') }}</div>
                <div v-if="dateState !== 'overview'" :class="[$style['bet-header-right'], { [$style['negative']]: Number(mainTotal.valid_bet) < 0 || Number(mainTotal.payoff) < 0 }]">{{ dateState === 'overview' ? mainTotal.valid_bet.toFixed(2) : mainTotal.payoff.toFixed(2) }}</div>
            </div>
            <div v-if="dateState === 'overview'" :class="$style['overview-wrap']">
                <div
                    v-for="(item, key) in allTotalData"
                    :key="`total-data-${key}`"
                    :class="[$style['overview-item'], $style[key]]"
                    @click="quickInquire(key); dateState = key"
                >
                    <div :class="$style['title']">{{ $text(item.text) }}</div>
                    <div :class="$style['amount']">{{ item.money }}</div>
                </div>
            </div>
            <div v-else-if="dateState === 'search' && showSearch" :class="$style['total-main-wrap']">
                <div v-if="showSearch" :class="$style['select-list']">
                    <div :class="$style['select-input']">
                        <div>{{ $text('S_PLEASE_SELECT_TYPE', '请选择类别') }}</div>
                        <select v-model="type">
                            <option
                                v-for="(option, key) in options"
                                :key="`option-${key}`"
                                :value="option.value"
                                :selected="type === option.text ? 'selected' : ''"
                            >
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div :class="$style['date-pick']">
                        <div>{{ $text('S_STARTED_DAY', '起始日') }}</div>
                        <input
                            v-model="startTime"
                            :max="endTime"
                            type="date"
                        />
                    </div>
                    <div :class="$style['date-pick']">
                        <div>{{ $text('S_END_DAY', '结束日') }}</div>
                        <input
                            v-model="endTime"
                            :min="startTime"
                            type="date"
                        />
                    </div>
                    <div :class="$style['select-list-btn']">
                        <button :class="$style['select-btn']" @click="setInquire()">{{ $text('S_INQUIRE', '查询') }}</button>
                    </div>
                </div>
            </div>
            <div v-else-if="dateState && !mainNoData && !showSearch" :class="$style['total-record-wrap']">
                <div :class="$style['sub-bet-record']">
                    <table>
                        <thead>
                            <tr>
                                <th>{{ $text('S_PLATFORM', '平台') }}</th>
                                <th>
                                    <span>{{ $text('S_VALID_BET', '有效投注') }}</span>
                                    <div :class="$style['sort-btn']" @click="inquire('valid_bet')" />
                                </th>
                                <th>
                                    <span>{{ $text('S_PAY_OUT', '派彩') }}</span>
                                    <div :class="$style['sort-btn']" @click="inquire('payoff')" />
                                </th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, key) in mainListData.slice((nowPage - 1) * countOfPage, nowPage * countOfPage)"
                                :key="`betRecord-${key}`"
                                :class="$style['bet-record-tr']"
                            >
                                <td>{{ gameName(item.vendor, item.kind) }}</td>
                                <td :class="[{ [$style['negative']]: Number(item.valid_bet) < 0 }]">{{ item.valid_bet }}</td>
                                <td :class="[{ [$style['negative']]: Number(item.payoff) < 0 }]">{{ item.payoff }}</td>
                                <td @click="showBetRecordDetail(gameName(item.vendor, item.kind), item.kind, item.vendor)">
                                    <icon name="chevron-right" scale="0.8" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <pagination
                    v-if="!mainNoData"
                    :class="$style.pagination"
                    :page.sync="nowPage"
                    :total="Math.ceil(mainListData.length / countOfPage)"
                />
            </div>
            <div v-else>
                <div :class="$style['no-data']">
                    <div :class="$style['no-data-img']" />
                    <p>{{ $text('S_NO_DATA_GENERATED', '尚未产生数据') }}</p>
                </div>
            </div>
            <div :class="[$style['remind-message'], { [$style['show']]: messageStatus }]">
                <div>{{ $text('S_CHANGE_PLEASE_CLICK', '更改查询条件请重复点击上方搜索') }}</div>
            </div>
        </template>
        <template v-else>
            <detail
                :types="detailAlias"
                :start-time="inquiryStartTime"
                :end-time="inquiryEndTime"
                :kind="detailKind"
                :vendor="detailVendor"
                :close-event="closeBetRecordDetail"
            />
        </template>
        <v-style>
            <!-- eslint-disable vue/html-indent -->
            .{{ $style['select-btn'] }} {
                background-image: url({{ $getCdnPath('/static/image/mobile/mcenter/btn_button_n.png') }});
            }
            <!-- eslint-enable vue/html-indent -->
        </v-style>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import mixin from '@/mixins/mcenter/betRecord';
import gameName from '@/lib/game_name';
import detail from './detail';
import pagination from '../pagination';

export default {
    components: {
        Swiper,
        SwiperSlide,
        detail,
        pagination
    },
    mixins: [mixin],
    data() {
        return {
            headerSetting: {
                title: this.$text('S_BETHISTORYBTN', '投注记录'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                },
                balance: true
            },
            categoryOptions: {
                slidesPerView: 'auto'
            },
            dateState: 'today',
            showDetail: false,
            showSearch: false,
            nowPage: 1,
            countOfPage: 5,
            detailAlias: '',
            detailKind: '',
            detailVendor: '',
            showAllDate: false,
            showBetBar: true,
            gameName
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    methods: {
        getGameName(item) {
            return gameName(item);
        },
        showBetRecordDetail(alias, kind, vendor) {
            this.detailAlias = alias;
            this.detailKind = kind;
            this.detailVendor = vendor;
        },
        closeBetRecordDetail() {
            this.detailAlias = '';
            this.detailKind = '';
            this.detailVendor = '';
        },
        gameListData() {
            const result = [];
            Object.keys(this.gameData).forEach((key) => {
                if (this.gameData[key].switch === 'N') return;
                const defaultData = {
                    kind: this.gameData[key].kind,
                    vendor: this.gameData[key].vendor,
                    alias: this.gameData[key].alias,
                    valid_bet: '0.00', // 有效投注額
                    counts: '0', // 總筆數
                    profit_ratio: 0.00 // 獲利比
                };
                const filterData = this.mainListData.filter((item) => item.kind === this.gameData[key].kind && item.vendor === this.gameData[key].vendor);
                result.push({
                    ...defaultData,
                    ...filterData[0]
                });
            });
            return result;
        },
        getTypeData(key) {
            this.showAllDate = false;
            this.dateState = key;

            if (key === 'search') {
                this.showSearch = !this.showSearch;
                return;
            }

            if (key === 'overview') {
                this.showSearch = false;
                return;
            }

            this.showSearch = false;
            this.quickInquire(key);
        },
        setInquire() {
            this.messageStatus = true;
            this.inquire().then(() => {
                this.showSearch = false;
            });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
