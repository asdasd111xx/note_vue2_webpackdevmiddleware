<template>
    <table class="all-friends-table">
        <thead>
            <tr>
                <!-- 好友級數(總) -->
                <th>{{ $text('S_FRIENDS_LEVEL') }}</th>
                <!-- 新增會員 -->
                <th>{{ $text('S_ADD_MEMBER') }}</th>
                <!-- 存款會員 -->
                <th>{{ $text('S_DEPOSITE_MEMBER') }}</th>
                <!-- 取款會員 -->
                <th>{{ $text('S_WITHDRAW_MEMBER') }}</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="info in levelList">
                <tr :key="info.depth">
                    <!-- 好友級數(總) -->
                    <td>{{ $text(levelTrans[info.depth]) }}({{ info.total }})</td>
                    <!-- 新增會員 -->
                    <td>{{ info.register }}</td>
                    <!-- 存款會員 -->
                    <td>{{ info.deposit }}</td>
                    <!-- 取款會員 -->
                    <td>{{ info.withdraw }}</td>
                </tr>
            </template>
            <template v-if="levelList.length">
                <!-- 總計 -->
                <tr class="total">
                    <td>{{ $text('S_TOTAL') }}({{ allTotal.total }})</td>
                    <td>{{ allTotal.register }}</td>
                    <td>{{ allTotal.deposit }}</td>
                    <td>{{ allTotal.withdraw }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<script>
import mixinAllFriends from '@/mixins/mcenter/management/mixinAllFriends';

/**
 * @param {Array} date - 日期
 */
export default {
    mixins: [mixinAllFriends],
    props: {
        date: {
            type: Array,
            required: true
        }
    },
    created() {
        this.getLevelList(this.date);
    }
};
</script>

<style lang="scss" src="../css/allFriends.scss" scoped></style>
