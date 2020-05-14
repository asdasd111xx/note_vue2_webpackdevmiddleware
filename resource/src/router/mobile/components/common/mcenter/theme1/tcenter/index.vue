<template>
    <div :class="[$style['device-wrap'], $style[`theme-${siteConfig.MOBILE_WEB_TPL}`]]">
        <mcenter-header :header-setting="headerSetting" />
        <div v-if="tabState" :class="[$style['tab-wrap'], 'clearfix']">
            <div
                v-for="(item, index) in tabItem"
                :key="`tab-${item.key}`"
                :class="[$style['tab-item'], { [$style['is-current']]: tabCurrent === index }]"
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
import ajax from '@/lib/ajax';
import { API_COMMISSION_LINK } from '@/config/api';
import mcenterHeader from '@/router/mobile/components/common/mcenter/theme1/header';

export default {
    components: {
        mcenterHeader,
        gameRecord: () => import(/* webpackChunkName: 'mcenter_theme1_gameRecord' */'./components/gameRecord/'),
        management: () => import(/* webpackChunkName: 'mcenter_theme1_management' */'./components/management/'),
        commission: () => import(/* webpackChunkName: 'mcenter_theme1_commission' */'./components/commission'),
        recommendGift: () => import(/* webpackChunkName: 'mcenter_theme1_recommendGift' */'./components/recommendGift')
    },
    props: {
        func: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            tabState: !(this.func === 'commission' && this.$route.params.id && this.$route.params.period),
            headerSetting: {
                title: this.$text('S_TEAM_CENTER', '我的推广'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => {
                        if (this.func === 'gameRecord') {
                            switch (this.$route.params.page) {
                                case 'bet':
                                    this.$router.push({ params: { page: 'main' } });
                                    break;
                                case 'detail':
                                    this.$router.push({ params: { page: 'bet' } });
                                    break;
                                default:
                                    this.$router.push('/mobile/mcenter');
                                    break;
                            }
                            return;
                        }
                        if (this.func === 'commission' && this.$route.params.id && this.$route.params.period) {
                            this.setTabState(true);
                            this.$router.push('/mobile/mcenter/tcenter/commission');
                            return;
                        }
                        this.$router.push('/mobile/mcenter');
                    }
                },
                balance: true
            },
            commissionLink: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            siteConfig: 'getSiteConfig'
        }),
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
                    show: !(this.memInfo.config.wage && this.commissionLink === '')
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
    created() {
        // 判斷佣金是否為第三方佣金
        if (this.memInfo.config.wage) {
            ajax({
                method: 'get',
                url: API_COMMISSION_LINK,
                success: (response) => {
                    if (response.ret.uri) {
                        this.commissionLink = response.ret.uri;
                    }
                }
            });
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        setTabCurrent(tabKey) {
            if (this.tabItem[tabKey].key === 'commission' && this.memInfo.config.wage && this.commissionLink) {
                const newWin = window.open('');

                ajax({
                    method: 'get',
                    url: API_COMMISSION_LINK,
                    success: (response) => {
                        if (response.ret.uri) {
                            newWin.location = response.ret.uri;
                            return;
                        }
                        newWin.close();
                    },
                    fail: () => {
                        newWin.close();
                    }
                });
                return;
            }
            this.$router.push(`/mobile/mcenter/tcenter/${this.tabItem[tabKey].key}`);
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

<style lang="scss" module>
.tab-wrap {
    background: url('/static/image/mobile/mcenter/bg_header2_iphone8.png') 50% -65px / 100% no-repeat #222;
}
.tab-item {
    float: left;
    line-height: 30px;
    padding: 0 16px;
    text-align: center;
    color: #BEBCBC;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.is-current {
        color: #FFF;
        border-bottom: 3px solid #F9DCB2;
    }
}
</style>
