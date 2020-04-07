<template>
    <div v-if="isReceive" class="management-wrap">
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
                <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_qrcode_n.png')" class="imgout" />
                <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_qrcode_h.png')" class="imgin" />
            </div>
            <!-- 推廣連結 Icon -->
            <div :class="['copy', { active: popupType === 'copy' }]" @click="onCopy('link')">
                <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_link_n.png')" class="imgout" />
                <img :src="$getCdnPath('/static/image/mobile/mcenter/icon_link_h.png')" class="imgin" />
            </div>
        </div>
        <!-- 一級好友相關資訊 -->
        <div class="first-level-info clearfix">
            <template v-for="info in firstLevelInfo">
                <div :key="info.text" class="level-info">
                    <img :src="$getCdnPath(`/static/image/mobile/mcenter/bg_${info.text}.png`)" />
                    <div class="number"><span>{{ info.value }}</span></div>
                    <div class="text"><span>{{ $text(info.text.toUpperCase()) }}</span></div>
                </div>
            </template>
        </div>
        <!-- 全部、一級好友頁籤 -->
        <div class="page-select">
            <model-select
                v-model="page"
                :options="options"
                :placeholder="$t('S_FIRST_LEVEL_FRIEND')"
            />
        </div>
        <template v-if="page === 'all'">
            <!-- 日期選擇器 -->
            <div class="datepicker-wrap clearfix">
                <div :class="['date-btn', { active: period === 'week' }]" @click="onPeriodChange('week')">{{ $text('THIS_WEEK') }}</div>
                <div :class="['date-btn', { active: period === 'last' }]" @click="onPeriodChange('last')">{{ $text('S_LAST_WEEK') }}</div>
                <flat-pickr-range
                    :min-date="limitTime"
                    :max-date="endTime"
                    :date.sync="date"
                />
            </div>
            <!-- 全部好友 -->
            <all-friends :date="date" />
        </template>
        <template v-else>
            <!-- 一級好友 -->
            <first-friends :current.sync="currentPage" :total.sync="totalPage" />
            <template v-if="totalPage">
                <!-- 分頁 -->
                <pagination :current.sync="currentPage" :total.sync="totalPage" />
            </template>
        </template>
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
import { ModelSelect } from 'vue-search-select';
import flatPickrRange from '@/components/flatPickrRange';
import mixinIndex from '@/mixins/mcenter/management/mixinIndex';
import pagination from '@/components/mcenter/template/common/pagination';
import allFriends from './components/allFriends';
import firstFriends from './components/firstFriends';
import recommend from './components/recommend';
import popup from './components/popup';

export default {
    components: {
        ModelSelect,
        allFriends,
        firstFriends,
        recommend,
        popup,
        pagination,
        flatPickrRange
    },
    mixins: [mixinIndex],
    created() {
        const params = [this.getDomain(), this.getAgentCode(), this.getFirstLevelInfo()];

        // 當所有 api 完成後再渲染
        Promise.all(params).then(() => {
            this.isReceive = true;
        });
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
