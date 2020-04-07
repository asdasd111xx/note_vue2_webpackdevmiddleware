<template>
    <div
        v-if="isReceive"
        :class="`management-wrap theme-${siteConfig.MOBILE_WEB_TPL}`"
    >
        <div :class="['top-link-wrap', { 'no-register': !memInfo.config.infinity_register }, 'clearfix']">
            <!-- 推薦好友 -->
            <template v-if="memInfo.config.infinity_register">
                <div class="recommend" @click="isRegister = true">
                    <span>{{ $text('S_FRIEND_RECOMMANDED') }}</span>
                </div>
            </template>
            <!-- 推廣代碼 -->
            <div class="code" @click="onCopy('code')">
                <span>{{ $text('S_PROMOTION_CODE') }}&nbsp;{{ agentCode }}</span>
            </div>
            <!-- QR Code Icon -->
            <div :class="['qrcode', { active: popupType === 'qrcode' }]" @click="onQrcodeOpen">
                <img :src="$getCdnPath('/static/image/mobile/mcenter/btn_qrcode.png')" class="imgout" />
                <img :src="$getCdnPath('/static/image/mobile/mcenter/btn_qrcode.png')" class="imgin" />
            </div>
            <!-- 推廣連結 Icon -->
            <div :class="['copy', { active: popupType === 'copy' }]" @click="onCopy('link')">
                <img :src="$getCdnPath('/static/image/mobile/mcenter/btn_line.png')" class="imgout" />
                <img :src="$getCdnPath('/static/image/mobile/mcenter/btn_line.png')" class="imgin" />
            </div>
        </div>
        <!-- 一級好友相關資訊 -->
        <div class="first-level-info clearfix">
            <template v-for="info in firstLevelInfo">
                <div :key="info.text" class="level-info">
                    <img :src="$getCdnPath(`/static/image/mobile/mcenter/team_ic_${teamBgMap[info.text]}.png`)" />
                    <div class="text"><span>{{ $text(info.text.toUpperCase()) }}</span></div>
                    <div class="number"><span>{{ info.value }}</span></div>
                </div>
            </template>
        </div>
        <!-- 搜尋框按鈕 -->
        <div class="search-icon-wrap">
            <img
                :src="$getCdnPath(`/static/image/mobile/mcenter/btn_inquire${ isSearchActive ? '_h' : '' }.png`)"
                class="search-icon"
                @click="isSearchActive = !isSearchActive"
            />
        </div>
        <!-- 搜尋框 -->
        <div v-if="isSearchActive" class="search-box">
            <!-- 全部、一級好友 -->
            <div class="type">
                <div>{{ $text('S_TYPE') }}</div>
                <select v-model="page">
                    <option
                        v-for="option in options"
                        :key="option.value"
                        :value="option.value"
                    >
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <!-- 日期選擇器 -->
            <div :class="['datepicker-wrap', {disabled: page === 'first'}]">
                <div :class="['date-btn', { active: period === 'week' }]" @click="onPeriodChange('week')">{{ $text('THIS_WEEK') }}</div>
                <div :class="['date-btn', { active: period === 'last' }]" @click="onPeriodChange('last')">{{ $text('S_LAST_WEEK') }}</div>
                <div class="start-date">
                    {{ $text('S_STARTED_DAY') }}
                    <input
                        v-model="date[0]"
                        :min="minDate"
                        :max="maxDate"
                        type="date"
                    />
                </div>
                <div class="end-date">
                    {{ $text('S_END_DAY') }}
                    <input
                        v-model="date[1]"
                        :min="minDate"
                        :max="maxDate"
                        type="date"
                    />
                </div>
            </div>
            <!-- 查詢 -->
            <div class="search-btn-wrap">
                <div class="search-btn" @click="onSearchClick">{{ $text('S_INQUIRE') }}</div>
            </div>
        </div>
        <!-- 資料區塊 -->
        <div v-show="!isSearchActive" class="data">
            <!-- 全部好友 -->
            <template v-if="searched.page === 'all'">
                <all-friends :date="searched.date" />
            </template>
            <!-- 一級好友 -->
            <template v-if="searched.page === 'first'">
                <first-friends :current="currentPage" :total.sync="totalPage" />
                <pagination
                    :page="+currentPage"
                    :total="totalPage"
                    @update:page="currentPage = `${$event}`"
                />
            </template>
        </div>

        <!-- 推薦一級好友 -->
        <template v-if="isRegister && memInfo.config.infinity_register">
            <recommend :code="agentCode" @close="isRegister = false" />
        </template>
        <!-- 連結複製提示與 QR Code -->
        <template v-if="isPopup">
            <popup
                :type="popupType"
                :link="agentLink"
                @close="onPopupClose"
            />
        </template>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import mixinIndex from '@/mixins/mcenter/management/mixinIndex';
import pagination from '@/router/mobile/components/common/mcenter/theme1/pagination';
import EST from '@/lib/EST';
import allFriends from './components/allFriends';
import firstFriends from './components/firstFriends';
import recommend from './components/recommend';
import popup from './components/popup';

export default {
    components: {
        allFriends,
        firstFriends,
        recommend,
        popup,
        pagination
    },
    mixins: [mixinIndex],
    data() {
        const estToday = EST(new Date(), '', true);
        const days = estToday.getDay() || 7; // 取得當前是星期幾，用來取得本週與上週的日期
        const startTime = Vue.moment(estToday).add(-(days - 1), 'days').format('YYYY-MM-DD');
        const endTime = Vue.moment(estToday).format('YYYY-MM-DD');
        const date = [startTime, endTime];
        return {
            teamBgMap: {
                today_has_login: 'login',
                today_register: 'registered',
                today_has_bet: 'bet',
                today_has_deposit: 'deposit',
                week_no_login: 'nologin'
            },
            isSearchActive: true,
            searched: {
                page: '',
                date: ''
            },
            date
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        minDate() {
            return Vue.moment(this.limitTime).format('YYYY-MM-DD');
        },
        maxDate() {
            return Vue.moment(this.estToday).format('YYYY-MM-DD');
        }
    },
    created() {
        const params = [this.getDomain(), this.getAgentCode(), this.getFirstLevelInfo()];

        // 當所有 api 完成後再渲染
        Promise.all(params).then(() => {
            this.isReceive = true;
        });
    },
    methods: {
        onSearchClick() {
            this.isSearchActive = false;
            this.searched.date = this.date;
            this.searched.page = this.page;
        },
        /**
         * 日期區間切換
         * @method onPeriodChange
         * @param {String} value - 選擇的區間
         */
        onPeriodChange(value) {
            this.date = [Vue.moment(this[value][0]).format('YYYY-MM-DD'), Vue.moment(this[value][1]).format('YYYY-MM-DD')];
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
