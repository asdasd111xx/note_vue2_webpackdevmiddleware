<template>
    <div :class="[$style.footer, 'clearfix']">
        <div
            v-for="info in list"
            :key="info.key"
            :class="[$style['footer-item'], $style[`${info.key}`], { [$style.active]: info.key === $route.name }]"
            @click="onClick(info)"
        >
            <img
                v-if="info.key === $route.name"
                :src="$getCdnPath(`/static/image/mobile/tpl/porn1/footer/icon_${info.key}_h.png`)"
            />
            <img
                v-else
                :src="$getCdnPath(`/static/image/mobile/tpl/porn1/footer/icon_${info.key}_n.png`)"
            />
            <div>{{ info.name }}</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        }),
        list() {
            return [
                { key: 'home', name: this.$text('S_HOME', '首页'), path: '/mobile' },
                { key: 'promotion', name: this.$text('S_PROMOTION', '优惠'), path: '/mobile/promotion' },
                { key: 'liveStream', name: this.$text('S_LIVE_STREAM', '直播'), path: '/mobile/liveStream' },
                { key: 'discover', name: this.$text('S_DISCOVER', '发现'), path: '/mobile/discover' },
                { key: 'mcenter-home', name: this.$text('S_INFORMATION', '我的'), path: '/mobile/mcenter' }
            ];
        }
    },
    methods: {
        onClick({ key, path }) {
            if ((key === 'mcenter-home' || key === 'liveStream') && !this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            this.$router.push(path);
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 60px;
    background-color: #393939;
    z-index: 2;
}

.footer-item {
    float: left;
    width: 20%;
    height: 45px;
    color: #9399A7;

    &.active {
        color: #FACE15;
    }

    > div {
        overflow: hidden;
        height: 21px;
        line-height: 21px;
        padding: 0 3px;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    > img {
        display: block;
        width: 18px;
        height: 18px;
        margin: 6px auto 0;
    }
}

.liveStream {
    position: relative;
    bottom: 16px;

    img {
        width: 40px;
        height: 40px;
        margin: 0 auto;
        border-radius: 50%;
    }
}


@media screen and (min-width: $phone) {
    .footer-item {
        > div {
            font-size: 13px;
        }
    }
}

@media screen and (min-width: $pad) {
    .footer-item {
        > div {
            font-size: 15px;
        }
    }
}
</style>
