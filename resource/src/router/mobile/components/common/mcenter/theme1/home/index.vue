<template>
    <div :class="[$style.home, $style[`theme-${siteConfig.MOBILE_WEB_TPL}`]]">
        <mcenter-header :class="$style.header" :header-setting="headerSetting" />
        <div :class="$style['top-bg']">
            <div :class="$style['info-bg']">
                <user-info />
            </div>
            <div :class="$style['news-wrap']">
                <span :class="$style['news-title']">{{ $text('S_HOT_NEWS_2') }}&nbsp;|</span>
                <news
                    :class="$style.news"
                    :speed="150"
                    :view-full-content="true"
                />
            </div>
            <div :class="[$style['tab-wrap'], 'clearfix']">
                <div
                    :class="{ [$style['is-active']]: filter === '' }"
                    @click="filter = ''"
                >
                    <span>{{ $text('S_ALL') }}</span>
                </div>
                <div
                    :class="{ [$style['is-active']]: filter === 'money' }"
                    @click="filter = 'money'"
                >
                    <span>{{ $text('S_MONEY_MANAGEMENT') }}</span>
                </div>
                <div
                    :class="{ [$style['is-active']]: filter === 'transaction' }"
                    @click="filter = 'transaction'"
                >
                    <span>{{ $text('S_TRANSACTION') }}</span>
                </div>
            </div>
        </div>
        <mcenter-list :filter="filter" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import news from '@/router/web/components/common/news';
import userInfo from './components/userInfo';
import mcenterList from './components/mcenterList';

export default {
    components: {
        mcenterHeader: () => import(/* webpackChunkName: 'mcenterHeader' */'../header'),
        userInfo,
        news,
        mcenterList
    },
    data() {
        return {
            headerSetting: {
                title: this.$text('S_MEM_CENTER', '会员中心'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile')
                },
                balance: true
            },
            currentTab: 0,
            currentEdit: '',
            filter: ''
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    },
    methods: {
        ...mapActions([])
    }
};
</script>

<style lang="scss" module>
.home {
    .header {
        background: url('/static/image/mobile/mcenter/bg_header_iphone8.png') 50% 0 / 100% no-repeat;
        // height: 117px;
    }
}

.top-bg {
    background-color: #FFF;
}

.info-bg {
    background: url("/static/image/mobile/mcenter/bg_header_iphone8.png") 50% 100%/100% no-repeat #FFF;
    height: 56px;
}

.news-wrap {
    margin: 0 auto;
    width: 90%;
    line-height: 2;
    color: #343A5D;
    white-space: nowrap;
    overflow: hidden;
}

.news-title {
    display: inline-block;
}

.news {
    display: inline-block;
    vertical-align: middle;
}

.tab-wrap {
    display: table;
    width: 100%;
    height: 40px;
    border-top: 1px solid #DDD;
    border-bottom: 1px solid #DDD;

    > div {
        position: relative;
        width: 33.33%;
        line-height: 1;
        color: #A37F5B;
        text-align: center;
        display: table-cell;
        vertical-align: middle;

        &::after {
            content: '';
            background-color: #BEBCBC;
            position: absolute;
            top: 7px;
            right: 0;
            width: 1px;
            height: 25px;
        }

        &:last-child {
            &::after {
                display: none;
            }
        }

        > span {
            display: inline-block;
            padding: 0 2px;
            width: 100%;
        }

        &.is-active {
            color: #00347D;
        }
    }
}
</style>
