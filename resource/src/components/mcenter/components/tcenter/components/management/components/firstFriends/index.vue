<template>
    <div :class="$style['first-friends-table']">
        <div :class="$style.thead">
            <div :class="[$style.row, 'clearfix']">
                <!-- 序 -->
                <div :class="[$style.column, $style.number]">{{ $text('S_NUMBER_NO') }}</div>
                <!-- 在線 -->
                <div :class="[$style.column, $style.online]">{{ $text('S_ONLINE') }}</div>
                <!-- 會員帳號 -->
                <div :class="[$style.column, $style.username]">{{ $text('S_NAME') }}</div>
                <!-- 狀態 -->
                <div :class="[$style.column, $style.status]">{{ $text('S_STATUS') }}</div>
                <!-- 主帳戶餘額 -->
                <div :class="[$style.column, $style.balance]">{{ $text('S_MAIN_BALANCE') }}</div>
            </div>
        </div>
        <div v-if="firstFriends.length" :class="$style.tbody">
            <template v-for="(info, index) in firstFriends">
                <div
                    :key="index"
                    :class="[$style.row, 'clearfix']"
                    @click="onChangeSubInfo(index)"
                >
                    <!-- 序 -->
                    <div :class="[$style.column, $style.number]"><span>{{ index + 1 }}</span></div>
                    <!-- 在線 -->
                    <div :class="[$style.column, $style.online]"><span :class="[$style['icon-online'], { [$style.active]: isOnline(info) }]" /></div>
                    <!-- 會員帳號 -->
                    <div :class="[$style.column, $style.username]"><span>{{ info.username }}</span></div>
                    <!-- 狀態 -->
                    <div :class="[$style.column, $style.status]">
                        <!-- 啟用 -->
                        <template v-if="info.enable">
                            <span :class="{ [$style.enable]: info.enable }">{{ $text('S_ENABLE') }}</span>
                        </template>
                        <!-- 停用 -->
                        <template v-else>
                            <span :class="{ [$style.disable]: !info.enable }">{{ $text('S_DISABLE') }}</span>
                        </template>
                        <!-- 凍結 -->
                        <template v-if="info.locked">
                            <span :class="{ [$style.locked]: info.locked }">{{ $text('S_LOCKED') }}</span>
                        </template>
                        <!-- 停權 -->
                        <template v-if="info.bankrupt">
                            <span :class="{ [$style.bankrupt]: info.bankrupt }">{{ $text('S_BANKRUPT') }}</span>
                        </template>
                    </div>
                    <!-- 主帳戶餘額 -->
                    <div :class="[$style.column, $style.balance]">
                        <span :class="$style.money">{{ info.cash.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</span>
                        <span :class="$style['icon-info']" />
                    </div>
                    <!-- 詳細資料 -->
                    <div v-show="subInfoIndex === index" :class="$style['info-wrap']">
                        <!-- 註冊方式 -->
                        <div :class="[$style['info-row'], 'clearfix']">
                            <div :class="$style.title">{{ $text('S_REGISTER_WAY') }}</div>
                            <div :class="$style.info">{{ $text(friendsTrans[info.created_by]) }}</div>
                        </div>
                        <!-- 註冊時間 -->
                        <div :class="[$style['info-row'], 'clearfix']">
                            <div :class="$style.title">{{ $text('S_REGISTER_TIME') }}</div>
                            <div :class="$style.info">{{ info.created_at | dateFormat }}</div>
                        </div>
                        <!-- 最後離線時間 -->
                        <div :class="[$style['info-row'], 'clearfix']">
                            <div :class="$style.title">{{ $text('S_LAST_ONLINE_TIME') }}</div>
                            <div :class="$style['info-online']">
                                <template v-if="!info.last_login"><span>--</span></template>
                                <template v-else-if="!info.last_online || isOnline(info)"><span :class="{ [$style.active]: isOnline(info) }">{{ $text('S_ONLINE') }}</span></template>
                                <template v-else><span>{{ info.last_online | dateFormat }}</span></template>
                            </div>
                        </div>
                        <!-- 狀態 -->
                        <div :class="[$style['info-row'], 'clearfix']">
                            <div :class="$style.title">{{ $text('S_STATUS') }}</div>
                            <div :class="$style['info-status']">
                                <!-- 啟用 -->
                                <template v-if="info.enable">
                                    <span :class="{ [$style.enable]: info.enable }">{{ $text('S_ENABLE') }}</span>
                                </template>
                                <!-- 停用 -->
                                <template v-else>
                                    <span :class="{ [$style.disable]: !info.enable }">{{ $text('S_DISABLE') }}</span>
                                </template>
                                <!-- 凍結 -->
                                <template v-if="info.locked">
                                    <span>&nbsp;/&nbsp;</span>
                                    <span :class="{ [$style.locked]: info.locked }">{{ $text('S_LOCKED') }}</span>
                                </template>
                                <!-- 停權 -->
                                <template v-if="info.bankrupt">
                                    <span>&nbsp;/&nbsp;</span>
                                    <span :class="{ [$style.bankrupt]: info.bankrupt }">{{ $text('S_BANKRUPT') }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div v-if="!firstFriends.length" :class="$style.tbody">
            <div :class="$style['no-data']">{{ $text('S_NO_FIRST_FRIEND_DATA') }}</div>
        </div>
    </div>
</template>

<script>
import firstLevelStatistics from '@/mixins/mcenter/management/firstLevelStatistics';

/**
 * @param {String} current - 當前頁數
 * @param {Number} total - 總頁數
 */
export default {
    mixins: [firstLevelStatistics],
    props: {
        current: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
