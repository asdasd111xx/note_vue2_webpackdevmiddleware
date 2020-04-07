<template>
    <div :class="colorClass">
        <mcenter-header :header-setting="headerSetting" />
        <div v-if="!$route.params.pid" :class="[$style['message-title-wrap'], 'clearfix']">
            <div
                v-for="item in menulist"
                :key="item.value"
                :class="[$style['message-center-title'], { [$style.active]: item.value === ($route.params.id || 'post') }]"
                @click="$router.push({ params: { id: item.value } })"
            >
                {{ item.text }}
            </div>
        </div>
        <component
            :is="$route.params.id"
            @changeTitle="value => headerSetting.title = value"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        post: () => import(/* webpackChunkName: 'post' */'./components/post'),
        message: () => import(/* webpackChunkName: 'message' */'./components/message'),
        feedback: () => import(/* webpackChunkName: 'feedback' */'./components/feedback'),
        mcenterHeader: () => import(/* webpackChunkName: 'mcenterHeader' */ '@/router/mobile/components/common/mcenter/theme1/header')
    },
    data() {
        return {
            menulist: [
                {
                    value: 'post',
                    text: this.$text('S_HOT_NEWS', '公告')
                },
                {
                    value: 'message',
                    text: this.$text('S_PERSONAL_MESSAGE', '站内信')
                },
                {
                    value: 'feedback',
                    text: this.$text('S_FEEDBACK', '意见反馈')
                }
            ],
            headerSetting: {
                title: this.$text('S_MSG_CENTER', '信息中心'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => {
                        if (this.$route.params.pid) {
                            this.$router.back();
                            return;
                        }

                        this.$router.push('/mobile/mcenter');
                    }
                },
                balance: true
            }
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo',
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module />
