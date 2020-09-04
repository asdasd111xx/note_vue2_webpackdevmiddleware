<template>
    <div :class="$style['page-header-wrap']">
        <div :class="$style['header-top-wrap']">
            <div :class="[$style['header-feature-wrap'], 'clearfix']">
                <marquee-news :title="$text('S_HOT_NEWS_2', '最新消息')" :theme="$style" />
                <lang-select :class="$style['header-lang-wrap']" />
            </div>
        </div>
        <div :class="$style['header-middle-wrap']">
            <div :class="[$style['middle-wrap'], 'clearfix']">
                <div :class="$style['logo-wrap']">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/52/header/logo.png')" />
                </div>
                <div :class="$style['header-title']">{{ $text('AGENT_CENTER', '代理中心') }}</div>
                <div :class="$style['right-feature-wrap']">
                    <div :class="$style['est-date']">{{ $text('S_TIME_OF_EAST_US', '美东时间') }}：{{ nowDate }}</div>
                    <div :class="[$style['operating-wrap'], 'clearfix']">
                        <div :class="$style['feature-wrap']" @click="onService">
                            <img
                                :src="$getCdnPath('/static/image/agent/miller/online.png')"
                                :class="$style['online-service-img']"
                            />
                            <div :class="$style['operating-text']" @click="onService">{{ $text('S_CUSTOMER_SERVICE_ONLINE', '在线客服') }}</div>
                        </div>
                        <div :class="[$style['feature-wrap'], 'clearfix']" @click="logout">
                            <img
                                :src="$getCdnPath('/static/image/agent/miller/exit.png')"
                                :class="$style['img-wrap']"
                            />
                            <div :class="$style['operating-text']">{{ $text('S_LOGOUT2', '退出登录') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { format } from 'date-fns';
import langSelect from '@/router/web/components/common/langSelect';
import marqueeNews from '../common/marqueeNews';

export default {
    components: {
        marqueeNews,
        langSelect
    },
    props: {
        logout: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            date: null,
            milli: null,
            timer: null
        };
    },
    computed: {
        ...mapGetters({
            systemTime: 'getSystemTime',
            onlineService: 'getOnlineService',
            webInfo: 'getWebInfo'
        }),
        nowDate() {
            if (!this.date) {
                return '---';
            }

            return this.date;
        }
    },
    created() {
        // date 轉美東時間
        this.date = new Date(this.systemTime).getTime() + ((new Date(this.systemTime).getTimezoneOffset() / 60) * 3600000) - 14400000;
        this.milli = +new Date(this.date);

        this.timer = setInterval(() => {
            this.milli += 1000;
            this.date = format(new Date(this.milli), 'yyyy-MM-dd HH:mm:ss');
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.actionChangePage({ page: 'service', type: 'static' });
        }
    }
};
</script>

<style lang="scss" module>
.page-header-wrap {
    padding-bottom: 5px;
    background-color: #FFF;
}

.header-top-wrap {
    background-color: #000;
}

.header-feature-wrap {
    width: 1255px;
    margin: 0 auto;
    padding-left: 66px;
}

.news-wrap {
    position: relative;
    float: left;
    width: 1066px;
    height: 40px;
    padding-left: 58px;

    :global(.news-content-wrap) {
        height: 40px;
        line-height: 40px;
        color: #CCC;
    }
}

.news-title {
    position: absolute;
    line-height: 40px;
    top: 0;
    left: 0;
    text-align: center;
    font-size: 12px;
    color: #F7B500;
}

.header-lang-wrap {
    float: right;
    margin-top: 11px;
}

.header-middle-wrap {
    margin: 0 auto;
    background-color: #F7B500;
}

.middle-wrap {
    width: 1255px;
    height: 95px;
    margin: 0 auto;
}

.logo-wrap {
    float: left;
    width: 170px;
    height: 68px;
    margin-top: 15px;
    cursor: pointer;

    img {
        display: block;
        width: 100%;
    }
}

.header-title {
    float: left;
    height: 95px;
    line-height: 95px;
    margin-left: 38px;
    font-size: 20px;
    color: #000;
}

.right-feature-wrap {
    float: right;
    height: 68px;
    margin-top: 29px;
}

.est-date {
    text-align: right;
    font-size: 14px;
    color: #000;
}

.operating-wrap {
    margin-top: 10px;
    text-align: right;
}

.feature-wrap {
    display: inline-block;
    vertical-align: middle;
    margin-left: 16px;
    cursor: pointer;
}

.online-service-img {
    display: inline-block;
    vertical-align: middle;
    width: 19px;
}

.img-wrap {
    display: inline-block;
    vertical-align: middle;
    width: 17px;
}

.operating-text {
    display: inline-block;
    vertical-align: middle;
    margin-left: 3px;
}
</style>
