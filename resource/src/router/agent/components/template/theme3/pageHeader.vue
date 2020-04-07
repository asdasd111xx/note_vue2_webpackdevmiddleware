<template>
    <div :class="$style.header">
        <div :class="[$style.wrap, 'clearfix']">
            <div :class="$style['logo-wrap']">
                <img src="/static/image/tpl/customizeHome/500000/logo.png" />
            </div>
            <div :class="$style.title">{{ $text('AGENT_CENTER', '代理中心') }}</div>
            <div :class="$style['agent-info']">
                <div :class="$style.date">E.S.T &nbsp;{{ nowDate }}</div>
                <div :class="[$style['func-wrap'], 'clearfix']">
                    <div :class="[$style.func, $style.envelope]" @click="$router.push('/agent/infoMessage')">
                        <icon
                            name="envelope"
                            width="30"
                            height="30"
                        />
                        <div v-if="agentInfo.msgCount" :class="$style.count">{{ agentInfo.msgCount }}</div>
                    </div>
                    <div :class="[$style.func, 'clearfix']" @click="$copyText('515387777')">
                        <div :class="[$style.func, $style.text]">合营部QQ:515387777</div>
                        <div :class="[$style.func, $style.copy]">
                            <icon
                                name="copy"
                                width="14"
                                height="16"
                            />
                        </div>
                    </div>
                    <div :class="[$style.func, $style.text]" @click="onService">在線客服</div>
                    <div :class="[$style.func, 'clearfix']" @click="logout">
                        <div :class="[$style.func, $style['sign-out-alt']]">
                            <icon
                                name="sign-out-alt"
                                width="14"
                                height="14"
                            />
                        </div>
                        <div :class="[$style.func, $style.text]">退出</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import EST from '@/lib/EST';

export default {
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
            isWebview: 'getIsWebview',
            systemTime: 'getSystemTime',
            agentInfo: 'getAgentInfo',
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
        this.date = EST(this.systemTime);
        this.milli = +new Date(this.date);
        this.timer = setInterval(() => {
            this.milli += 1000;
            this.date = Vue.moment(this.milli).format('YYYY-MM-DD HH:mm:ss');
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        ...mapActions([
            'actionSetAgentLogin',
            'actionChangePage'
        ]),
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.actionChangePage({ page: 'service', type: 'static' });
        },
        goContact() {
            const domain = this.webInfo.alias;
            const links = {
                500000: '30798',
                48: '10479',
                50: '10512'
            };

            window.open(`/page/${links[domain]}`);
        }
    }
};
</script>

<style lang="scss" module>
.header {
    margin-bottom: 14px;
    background-color: #FFF;
}

.wrap {
    width: 1200px;
    height: 68px;
    margin: 0 auto;
}

.logo-wrap {
    float: left;
    width: 173px;
    height: 54px;
    margin: 7px 32px;
}

.title {
    float: left;
    height: 68px;
    line-height: 68px;
    color: #707070;
    font-size: 20px;
}

.agent-info {
    float: right;
    height: 68px;
    margin-right: 17px;
    padding: 12px 0 6px;
}

.date {
    color: #707070;
    font-size: 14px;
    text-align: right;
}

.func-wrap {
    height: 30px;

    > .func {
        margin-left: 20px;
        cursor: pointer;
    }
}

.func {
    float: left;

    > .text {
        margin-left: 6px;
    }
}

.icon {
    > svg {
        display: block;
    }
}

.envelope {
    composes: icon;
    position: relative;
    color: #DFAF50;
}

.sign-out-alt {
    composes: icon;
    padding: 8px 0;
    color: #B88922;
}

.copy {
    composes: icon;
    margin-left: 2px;
    padding: 7px 0;
    color: #CCC;

    &:hover {
        color: #B88922;
    }
}

.count {
    position: absolute;
    top: -2px;
    right: -6px;
    min-width: 12px;
    height: 12px;
    line-height: 12px;
    padding: 0 3px;
    border-radius: 50%;
    background-color: #EB5B5B;
    color: #FFF;
    font-size: 12px;
    text-align: center;
}

.text {
    position: relative;
    line-height: 30px;
    color: #B88922;
    font-size: 14px;
}
</style>
