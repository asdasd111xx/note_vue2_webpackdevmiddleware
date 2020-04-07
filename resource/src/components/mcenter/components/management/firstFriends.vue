<template>
    <table v-if="isReceive" class="first-friends-table">
        <thead>
            <tr>
                <!-- 序 -->
                <th class="number"><span>{{ $text('S_NUMBER_NO') }}</span></th>
                <!-- 會員帳號 -->
                <th class="username"><span>{{ $text('S_NAME') }}</span></th>
                <!-- 狀態 -->
                <th class="status"><span>{{ $text('S_STATUS') }}</span></th>
                <!-- 註冊方式 -->
                <th class="way"><span>{{ $text('S_REGISTER_WAY') }}</span></th>
                <!-- 註冊時間 -->
                <th class="time sort" @click="onSort('created_at')">
                    <span>{{ $text('S_REGISTER_TIME') }}</span>
                    <span>
                        <icon
                            v-if="sort === 'created_at'"
                            :name="`${order['created_at'] ? 'caret-up' : 'caret-down'}`"
                        />
                        <icon
                            v-else
                            name="sort"
                        />
                    </span>
                </th>
                <!-- 最後離線時間 -->
                <th class="time sort" @click="onSort('last_online')">
                    <span>{{ $text('S_LAST_ONLINE_TIME') }}</span>
                    <span>
                        <icon
                            v-if="sort === 'last_online'"
                            :name="`${order['last_online'] ? 'caret-up' : 'caret-down'}`"
                        />
                        <icon
                            v-else
                            name="sort"
                        />
                    </span>
                </th>
                <!-- 主帳戶餘額 -->
                <th class="balance"><span>{{ $text('S_MAIN_BALANCE') }}</span></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="firstFriends.length">
                <tr v-for="(info, index) in firstFriends" :key="index">
                    <!-- 序 -->
                    <td class="number">{{ index + 1 }}</td>
                    <!-- 會員帳號 -->
                    <td class="username">{{ info.username }}</td>
                    <!-- 狀態 -->
                    <td class="status">
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
                    </td>
                    <!-- 註冊方式 -->
                    <td class="way">{{ $text(friendsTrans[info.created_by]) }}</td>
                    <!-- 註冊時間 -->
                    <td class="time">{{ info.created_at | dateFormat }}</td>
                    <!-- 最後離線時間 -->
                    <td class="time">
                        <template v-if="!info.last_login">--</template>
                        <template v-else-if="!info.last_online || isOnline(info)">{{ $text('S_ONLINE') }}</template>
                        <template v-else>{{ info.last_online | dateFormat }}</template>
                    </td>
                    <!-- 主帳戶餘額 -->
                    <td class="balance">{{ info.cash.balance | commaFormat }}</td>
                </tr>
            </template>
            <template v-else>
                <tr>
                    <td colspan="7" class="no-data">{{ $text('S_NO_DATA_YET') }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<script>
import mixinFirstFriends from '@/mixins/mcenter/management/mixinFirstFriends';

/**
 * @param {String} current - 當前頁數
 * @param {Number} total - 選擇總頁數
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
        // 當所有 api 完成後再渲染
        Promise.all([this.getFirstFriends()]).then(() => {
            this.isReceive = true;
        });
    }
};
</script>

<style lang="scss" src="./css/firstFriends.scss" scoped></style>
