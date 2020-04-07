<template>
    <div v-if="firstFriends.length" class="first-friends-table">
        <div class="thead">
            <div class="row clearfix">
                <!-- 序 -->
                <div class="column number">{{ $text('S_NUMBER_NO') }}</div>
                <!-- 在線 -->
                <div class="column online">{{ $text('S_ONLINE') }}</div>
                <!-- 會員帳號 -->
                <div class="column username">{{ $text('S_NAME') }}</div>
                <!-- 主帳戶餘額 -->
                <div class="column balance">{{ $text('S_MAIN_BALANCE') }}</div>
            </div>
        </div>
        <div class="tbody">
            <template v-for="(info, index) in firstFriends">
                <div
                    :key="index"
                    class="row clearfix"
                    @click="onChangeSubInfo(index)"
                >
                    <!-- 序 -->
                    <div class="column number"><span>{{ index + 1 }}</span></div>
                    <!-- 在線 -->
                    <div class="column online"><span :class="['icon-online', { active: isOnline(info) }]" /></div>
                    <!-- 會員帳號 -->
                    <div class="column username"><span>{{ info.username }}</span></div>
                    <!-- 主帳戶餘額 -->
                    <div class="column balance">
                        <span class="money">{{ info.cash.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}</span>
                        <span class="icon-info" />
                    </div>
                    <!-- 詳細資料 -->
                    <div v-show="subInfoIndex === index" class="info-wrap">
                        <!-- 註冊方式 -->
                        <div class="info-row clearfix">
                            <div class="title">{{ $text('S_REGISTER_WAY') }}</div>
                            <div class="info">{{ $text(friendsTrans[info.created_by]) }}</div>
                        </div>
                        <!-- 註冊時間 -->
                        <div class="info-row clearfix">
                            <div class="title">{{ $text('S_REGISTER_TIME') }}</div>
                            <div class="info">{{ info.created_at | dateFormat }}</div>
                        </div>
                        <!-- 最後離線時間 -->
                        <div class="info-row clearfix">
                            <div class="title">{{ $text('S_LAST_ONLINE_TIME') }}</div>
                            <div class="info-online">
                                <template v-if="!info.last_login"><span>--</span></template>
                                <template v-else-if="!info.last_online || isOnline(info)"><span :class="{ active: isOnline(info) }">{{ $text('S_ONLINE') }}</span></template>
                                <template v-else><span>{{ info.last_online | dateFormat }}</span></template>
                            </div>
                        </div>
                        <!-- 狀態 -->
                        <div class="info-row clearfix">
                            <div class="title">{{ $text('S_STATUS') }}</div>
                            <div class="info-status">
                                <!-- 啟用 -->
                                <template v-if="info.enable">
                                    <span :class="{ enable: info.enable }">{{ $text('S_ENABLE') }}</span>
                                </template>
                                <!-- 停用 -->
                                <template v-else>
                                    <span :class="{ disable: !info.enable }">{{ $text('S_DISABLE') }}</span>
                                </template>
                                <!-- 凍結 -->
                                <template v-if="info.locked">
                                    <span>&nbsp;/&nbsp;</span>
                                    <span :class="{ locked: info.locked }">{{ $text('S_LOCKED') }}</span>
                                </template>
                                <!-- 停權 -->
                                <template v-if="info.bankrupt">
                                    <span>&nbsp;/&nbsp;</span>
                                    <span :class="{ bankrupt: info.bankrupt }">{{ $text('S_BANKRUPT') }}</span>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import mixinFirstFriends from '@/mixins/mcenter/management/mixinFirstFriends';

/**
 * @param {String} current - 當前頁數
 * @param {Number} total - 總頁數
 */
export default {
    mixins: [mixinFirstFriends],
    props: {
        current: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    created() {
        this.getFirstFriends();
    }
};
</script>

<style lang="scss" src="../css/firstFriends.scss" scoped></style>
