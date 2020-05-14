<template>
    <div :class="mainClass">
        <mcenter-header :header-setting="headerSetting" />
        <div v-if="tabState" :class="[$style['tab-wrap'], 'clearfix']">
            <div
                v-for="(item, index) in tabItem"
                :key="`tab-${item.key}`"
                :class="[
                    $style['tab-item'],
                    { [$style['is-current']]: tabCurrent === index }
                ]"
                :style="{ width: `${100 / tabItem.length}%` }"
                @click="setTabCurrent(index)"
            >
                {{ item.text }}
            </div>
        </div>
        <component
            :is="func"
            :set-tab-state="setTabState"
            :set-header-title="setHeaderTitle"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenterHeader from '../header';

export default {
    components: {
        mcenterHeader,
        gameRecord: () => import(
            /* webpackChunkName: 'mcenter_pron1_gameRecord' */ './components/gameRecord/'
        ),
        management: () => import(
            /* webpackChunkName: 'mcenter_pron1_management' */ './components/management/'
        ),
        commission: () => import(
            /* webpackChunkName: 'mcenter_pron1_commission' */ './components/commission'
        ),
        recommendGift: () => import(
            /* webpackChunkName: 'mcenter_pron1_recommendGift' */ './components/recommendGift'
        )
    },
    props: {
        func: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            tabState: !(
                (this.func === 'commission'
                    && this.$route.params.id
                    && this.$route.params.period)
                || (this.func === 'management'
                    && this.$route.params.page
                    && this.$route.params.date)
            ),
            headerSetting: {
                title: this.$text('S_TEAM_CENTER', '我的推广'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => {
                        if (this.func === 'gameRecord') {
                            switch (this.$route.params.page) {
                                case 'bet':
                                    this.setTabState(true);
                                    this.$router.push({
                                        params: { page: 'main' }
                                    });
                                    break;
                                default:
                                    this.$router.push('/mobile/mcenter');
                                    break;
                            }
                            return;
                        }
                        if (
                            this.func === 'commission'
                            && this.$route.params.page === 'detail'
                        ) {
                            this.setTabState(true);
                            this.$router.push(
                                '/mobile/mcenter/tcenter/commission/record'
                            );
                            return;
                        }
                        if (
                            this.func === 'management'
                            && this.$route.params.page
                            && this.$route.params.date
                        ) {
                            this.setTabState(true);
                            this.$router.push(
                                '/mobile/mcenter/tcenter/management/member'
                            );
                            return;
                        }
                        this.$router.push('/mobile/mcenter');
                    }
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            siteConfig: 'getSiteConfig'
        }),
        mainClass() {
            const theme = `theme-${this.siteConfig.MOBILE_WEB_TPL}`;
            const site = `site-${this.memInfo.user.domain}`;

            return {
                'team-center-wrap': true,
                [this.$style[theme]]: this.$style[theme],
                [this.$style[site]]: this.$style[site],
                [this.$style['preset-color']]: !this.$style[site]
            };
        },
        tabItem() {
            return [
                {
                    key: 'management',
                    text: this.$text('S_TEAM_MANAGEMENT'),
                    show: true
                },
                {
                    key: 'gameRecord',
                    text: this.$text('S_GAME_RECORD'),
                    show: true
                },
                {
                    key: 'commission',
                    text: this.$text('S_MY_COMMISSION'),
                    show: true
                },
                {
                    key: 'recommendGift',
                    text: '推荐礼金',
                    show: true
                }
            ].filter((item) => item.show);
        },
        tabCurrent() {
            return this.tabItem.findIndex((item) => this.$route.path.includes(item.key));
        }
    },
    methods: {
        ...mapActions(['actionChangePage']),
        setTabCurrent(tabKey) {
            if (this.tabItem[tabKey].key === 'commission') {
                this.$router.push('/mobile/mcenter/tcenter/commission/summary');
                return;
            }
            this.$router.push(
                `/mobile/mcenter/tcenter/${this.tabItem[tabKey].key}`
            );
        },
        setTabState(state) {
            this.tabState = state;
        },
        setHeaderTitle(value) {
            this.$set(this.headerSetting, 'title', value);
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
