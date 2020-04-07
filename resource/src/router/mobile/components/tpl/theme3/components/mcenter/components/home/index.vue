<template>
    <mobile-container class="theme-theme3">
        <div slot="content" :class="$style['mcenter-wrap']">
            <div :class="$style['msg-icon']">
                <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/message_icon.png')" @click="goMessage()" />
            </div>
            <vip-info />
            <img-link />
            <mem-list />
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/mobileContainer';
import vipInfo from './components/vipInfo';
import imgLink from './components/imgLink';
import memList from './components/memList';

export default {
    components: {
        mobileContainer,
        vipInfo,
        imgLink,
        memList
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    created() {

    },
    methods: {
        goMessage() {
            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }
            this.$router.push('/mobile/mcenter/information/message');
        }
    }
};
</script>

<style lang="scss" module>
    .mcenter-wrap{
        overflow-y: scroll;
        .msg-icon {
            margin: 5px auto;
            width: 94%;
            height: 28px;
            img {
                float: right;
                width: 28px;
            }
        }

    }
</style>
