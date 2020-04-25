<template>
    <div :class="mainClass">
        <div v-if="!$route.params.date" :class="$style['top-link-wrap']">
            <div
                :class="{ [$style.active]: $route.params.page === 'promote' }"
                @click="$router.push('/mobile/mcenter/tcenter/management/promote')"
            >
                <span>{{ $text('S_FRIENDS_PROMOTE', '推广信息') }}</span>
            </div>
            <div
                :class="{ [$style.active]: $route.params.page === 'member' }"
                @click="$router.push('/mobile/mcenter/tcenter/management/member')"
            >
                <span>{{ $text('S_MEMBER_STATUS', '会员概况') }}</span>
            </div>
            <div
                :class="{ [$style.active]: $route.params.page === 'friends' }"
                @click="$router.push('/mobile/mcenter/tcenter/management/friends')"
            >
                <span>{{ $text('S_FIRST_LEVEL_FRIEND', '一级好友') }}</span>
            </div>
        </div>
        <template v-if="$route.params.page === 'member'">
            <member-info :set-tab-state="setTabState" :set-header-title="setHeaderTitle" />
        </template>
        <template v-else-if="$route.params.page === 'promote'">
            <recommend />
        </template>
        <template v-else-if="$route.params.page === 'friends'">
            <first-friends :current="currentPage" :total.sync="totalPage" />
            <pagination
                :class="$style.pagination"
                :page="+currentPage"
                :total="totalPage"
                @update:page="currentPage = `${$event}`"
            />
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import management from '@/mixins/mcenter/management/index';

export default {
    components: {
        pagination: () => import(/* webpackChunkName: 'pagination' */'@/router/mobile/components/common/mcenter/theme1/pagination'),
        memberInfo: () => import(/* webpackChunkName: 'memberInfo' */'./components/memberInfo/index'),
        firstFriends: () => import(/* webpackChunkName: 'firstFriends' */'./components/firstFriends/index'),
        recommend: () => import(/* webpackChunkName: 'recommend' */'./components/recommend/index')
    },
    mixins: [management],
    props: {
        setTabState: {
            type: Function,
            required: true
        },
        setHeaderTitle: {
            type: Function,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        mainClass() {
            const site = `site-${this.memInfo.user.domain}`;

            return {
                'management-wrap': true,
                [this.$style[site]]: this.$style[site],
                [this.$style['preset-color']]: !this.$style[site]
            };
        }
    },
    created() {
        if (this.$route.params.page) {
            return;
        }

        this.$router.push({ name: 'mcenter-tcenter-management', params: { page: 'member' } });
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
