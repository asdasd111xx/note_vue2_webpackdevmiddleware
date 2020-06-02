<template>
    <table v-if="levelList.length" :class="mainClass">
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
        </tbody>
        <tfoot>
            <template>
                <!-- 總計 -->
                <tr>
                    <td>{{ $text('S_TOTAL') }}({{ allTotal.total }})</td>
                    <td>{{ allTotal.register }}</td>
                    <td>{{ allTotal.deposit }}</td>
                    <td>{{ allTotal.withdraw }}</td>
                </tr>
            </template>
        </tfoot>
    </table>
</template>

<script>
import { mapGetters } from 'vuex';
import allLevelStatistics from '@/mixins/mcenter/management/allLevelStatistics';

/**
 * @param {Array} date - 日期
 */
export default {
    mixins: [allLevelStatistics],
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        mainClass() {
            const site = `site-${this.memInfo.user.domain}`;

            return {
                [this.$style['all-friends-table']]: true,
                [this.$style[site]]: this.$style[site],
                [this.$style['preset-color']]: !this.$style[site]
            };
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
