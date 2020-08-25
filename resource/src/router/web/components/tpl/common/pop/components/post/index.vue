<template>
    <!-- <ele1 :data="data" /> -->
    <ele2 :config="config" :data="data" />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        ele2: () => import(/* webpackChunkName: 'ele2' */'./2') // 新版
    },
    props: {
        config: {
            type: Object,
            default: () => ({})
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters({
            postData: 'getPost',
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        const isLogin = this.loginStatus ? 'Y' : 'N';
        const cookieName = `postStatus${isLogin + this.postData.config.last_modified_at}`;

        if (!this.postData.config.popup || this.$cookie.get(cookieName) === 'true') {
            this.$cookie.set(cookieName, true, { path: '/', expires: '' });
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ])
    }
};
</script>
