<template>
    <div v-if="isReceive" class="management-wrap">
        <div class="top-management-wrap">
            <table class="top-table">
                <thead>
                    <tr>
                        <th colspan="7">{{ $text('S_FIRST_LEVEL_FRIEND_OVERVIEW') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <!-- 一級好友資訊 -->
                        <td
                            v-for="info in firstLevelInfo"
                            :key="info.text"
                            class="top-info"
                        >
                            <div class="info-wrap">
                                <img :src="$getCdnPath(`/static/image/mcenter/icon_${info.text}.png`)" />
                                <div class="text">{{ $text(info.text.toUpperCase()) }}</div>
                                <div class="value">{{ info.value }}</div>
                            </div>
                        </td>
                        <!-- QR Code -->
                        <td class="qrcode">
                            <qrcode :value="agentLink" tag="img" />
                        </td>
                        <!-- 推廣代碼、複製連結、推薦好友 -->
                        <td class="func">
                            <div
                                class="code"
                                @click="onCopy('code')"
                            >
                                <span><img :src="$getCdnPath('/static/image/mcenter/icon_code.png')" /></span>
                                <span>{{ agentCode }}</span>
                                <div class="tips-wrap">
                                    {{ $text('S_PROMOTION_CODE') }}
                                    <span class="icon" />
                                </div>
                            </div>
                            <div
                                class="link"
                                @click="onCopy('link')"
                            >
                                <span><img :src="$getCdnPath('/static/image/mcenter/icon_copy.png')" /></span>
                                <span>{{ $text('S_COPY_LINK') }}</span>
                            </div>
                            <div
                                v-if="memInfo.config.infinity_register"
                                class="recommend"
                                @click="isRegister = true"
                            >
                                <span><img :src="$getCdnPath('/static/image/mcenter/icon_recommend.png')" /></span>
                                <span>{{ $text('S_FRIEND_RECOMMANDED') }}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="main-management-wrap">
            <!-- 全部、一級好友切換按鈕與日期選擇器 -->
            <div class="datepicker-wrap clearfix">
                <div :class="['page-btn', { active: page === 'first' }]" @click="page = 'first'">{{ $text('S_FIRST_LEVEL_FRIEND') }}</div>
                <div :class="['page-btn', { active: page === 'all' }]" @click="page = 'all'">{{ $text('S_ALL') }}</div>
                <template v-if="page === 'all'">
                    <select
                        v-model="period"
                        class="date-select"
                        @change="onPeriodChange"
                    >
                        <option value="week">{{ $text('THIS_WEEK') }}</option>
                        <option value="last">{{ $text('S_LAST_WEEK') }}</option>
                        <option value="search">{{ $text('S_TIME_RANGE') }}</option>
                    </select>
                    <datepicker
                        v-model="startTime"
                        :language="dateLang"
                        :monday-first="true"
                        :disabled="{ to:limitTime, from: estToday }"
                        format="yyyy-MM-dd"
                        @selected="onDateSelected('start', $event)"
                    />
                    <div class="date-line">-</div>
                    <datepicker
                        v-model="endTime"
                        :language="dateLang"
                        :monday-first="true"
                        :disabled="{ to:limitTime, from: estToday }"
                        format="yyyy-MM-dd"
                        @selected="onDateSelected('end', $event)"
                    />
                    <div class="inquire-btn" @click="onInquire">{{ $text('S_INQUIRE') }}</div>
                </template>
            </div>
            <!-- 全部好友 -->
            <template v-if="page === 'all'">
                <all-friends :date="date" />
            </template>
            <!-- 一級好友 -->
            <template v-else>
                <first-friends :current.sync="currentPage" :total.sync="totalPage" />
                <template v-if="totalPage">
                    <!-- 分頁 -->
                    <pagination :current.sync="currentPage" :total.sync="totalPage" />
                </template>
            </template>
        </div>
        <!-- 推薦一級好友 -->
        <template v-if="isRegister && memInfo.config.infinity_register">
            <recommend :code="agentCode" @close="isRegister = false" />
        </template>
        <!-- 提示用的彈跳視窗 -->
        <transition name="fade">
            <div v-if="isPopup" class="popup-wrap">
                <div class="popup-container">{{ $text(`S_${popupType}_COPIED`) }}</div>
            </div>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import datepicker from 'vuejs-datepicker';
import mixinIndex from '@/mixins/mcenter/management/mixinIndex';
import firstFriends from './firstFriends';
import allFriends from './allFriends';
import recommend from './recommend';
import pagination from '../../template/common/pagination';

export default {
    components: {
        datepicker,
        firstFriends,
        allFriends,
        recommend,
        pagination
    },
    mixins: [mixinIndex],
    created() {
        this.actionSetIsLoading(true);
        this.startTime = new Date(Vue.moment(this.estToday).add(-(this.days - 1), 'days'));
        this.endTime = this.estToday;
        this.limitTime = new Date(Vue.moment(this.estToday).add(-29, 'days'));
        this.week = [this.startTime, this.endTime];
        this.last = [
            new Date(Vue.moment(this.estToday).add(-((this.days - 1) + 7), 'days')),
            new Date(Vue.moment(this.estToday).add(-((this.days - 1) + 1), 'days'))
        ];
        this.date = [this.startTime, this.endTime];

        const params = [this.getDomain(), this.getAgentCode(), this.getFirstLevelInfo()];

        // 當所有 api 完成後再渲染
        Promise.all(params).then(() => {
            this.isReceive = true;
            this.actionSetIsLoading(false);
        });
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ])
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
