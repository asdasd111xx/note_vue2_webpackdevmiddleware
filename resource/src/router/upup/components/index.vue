<template>
    <div class="upup">
        <div class="image">
            <img :src="$getCdnPath('/static/image/upup.png')" />
        </div>
        <div class="text">
            <div>{{ $t('ROUTER_UPUP_TEXT_1') }}</div>
            <div>{{ $t('ROUTER_UPUP_TEXT_2') }}</div>
            <template v-if="start && end">
                <div class="time">
                    <div>{{ $text('S_LOCAL_TIME', '当地时间') }} ({{ localGMT }})</div>
                    <span>{{ start }}</span> ~ <span>{{ end }}</span>
                </div>
            </template>
        </div>
        <floating-pic mobile-show />
    </div>
</template>

<script>
/* global $ */
import Vue from 'vue';
import store from '@/store';
import member from '@/api/member';
import getLang from '@/lib/getLang';
import floatingPic from '@/router/web/components/tpl/common/float/floatingPic';

export default {
    components: {
        floatingPic
    },
    data() {
        return {
            start: '',
            end: ''
        };
    },
    beforeRouteEnter(to, from, next) {
        getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
            member.data({
                success: (response) => {
                    // 測試模式
                    if (to.params.mode && to.params.mode === 'test') {
                        store.dispatch('actionSetWebInfo', response.ret.user.domain).then(() => {
                            next();
                        });
                    } else {
                        next({ path: '/' });
                    }
                },
                fail: (response) => {
                    store.dispatch('actionSetWebInfo', response.data.extra ? response.data.extra.domain : '').then(() => {
                        next((vm) => vm.setData(response.data.extra));
                    });
                }
            });
        });
    },
    computed: {
        localGMT() {
            return `GMT${Vue.moment(new Date()).format('Z')}`;
        }
    },
    created() {
        $(document).prop('title', this.$t('S_UNDER_MAINTENANCE'));
    },
    methods: {
        setData(data) {
            if (!data || !data.end_at) return;

            // 將時間統一轉為UTC，再進行本地時區計算
            this.start = Vue.moment(data.start_at).utc().subtract((new Date().getTimezoneOffset() / 60), 'hours').format('YYYY-MM-DD HH:mm:ss');
            this.end = Vue.moment(data.end_at).utc().subtract((new Date().getTimezoneOffset() / 60), 'hours').format('YYYY-MM-DD HH:mm:ss');
        }
    }
};
</script>

<style lang="scss" src="@/css/router/upup.scss"></style>
