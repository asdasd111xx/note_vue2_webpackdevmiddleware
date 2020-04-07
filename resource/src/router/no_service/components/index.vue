<template>
    <div v-show="status" class="no-service">
        <div class="image">
            <img :src="$getCdnPath('/static/image/iparea.png')" />
        </div>
        <div class="text">{{ $t('ROUTER_NO_SERVICE_TEXT') }}</div>
        <div class="text">IP：{{ ip }}({{ code }})</div>
    </div>
</template>

<script>
import Vue from 'vue';
import member from '@/api/member';
import getLang from '@/lib/getLang';

export default {
    data() {
        return {
            ip: '',
            code: '',
            status: false
        };
    },
    beforeRouteEnter(to, from, next) {
        getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
            next();
        });
    },
    created() {
        member.data({
            success: () => {
                if (this.$route.params.mode && this.$route.params.mode === 'test') {
                    this.status = true;
                } else {
                    this.$router.push({ path: '/' });
                }
            },
            fail: (response) => {
                this.ip = response.data.ip;
                this.code = response.data.code;
                this.status = true;
            }
        });
    }
};
</script>

<style lang="scss" src="@/css/router/no_service.scss"></style>
