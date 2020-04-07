<template>
    <div>
        <join-member :theme="$style">
            <template slot="join-header" />
        </join-member>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .{{ $style['join-banner-icon'] }} {
                background: url({{ $getCdnPath('/static/image/join_icon.png') }}) 0 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import joinMember from '@/router/web/components/page/join_member';

export default {
    components: {
        joinMember
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        if (this.loginStatus) {
            this.$router.push('/mobile');
        }
    }
};
</script>

<style src="../../../css/join/joinMem_mobile.module.scss" lang="scss" module>
