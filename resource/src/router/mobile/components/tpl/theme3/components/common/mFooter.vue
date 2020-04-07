<template>
    <div :class="[$style.footer, 'clearfix']">
        <ul>
            <li
                v-for="link in links"
                :key="link.type"
                :class="[$style['footer-item'], { [$style.active]: $route.name === link.type }]"
                @click="changePage(link.path)"
            >
                <i :class="[$style.icon, $style[`icon-${link.type}`]]" />
                <span>{{ link.text }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileOpenLink from '@/lib/mobile_link_open';

export default {
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            onlineService: 'getOnlineService'
        }),
        links() {
            const links = {
                home: {
                    type: 'home',
                    text: this.$text('S_HOME', '首页'),
                    path: '/mobile'
                },
                promotion: {
                    type: 'promotion',
                    text: this.$text('S_PROMOTIONS_3', '优惠'),
                    path: '/mobile/promotion'
                },
                service: {
                    type: 'service',
                    text: this.$text('S_SERVIEC', '客服'),
                    path: 'service'
                },
                login: {
                    type: 'login',
                    text: this.$text('S_LOGON', '登录'),
                    path: '/mobile/login'
                },
                mcenter: {
                    type: 'mcenter',
                    text: this.$text('S_INFORMATION', '我的'),
                    path: '/mobile/mcenter'
                }
            };

            if (this.loginStatus) {
                return ['home', 'promotion', 'service', 'mcenter'].map((key) => links[key]);
            }

            return ['home', 'promotion', 'service', 'login'].map((key) => links[key]);
        }
    },
    methods: {
        mobileOpenLink,
        changePage(path) {
            if (path === 'service') {
                if (!this.onlineService.url) {
                    return;
                }

                this.mobileOpenLink({ linkType: 'static', linkTo: 'service' });
                return;
            }

            this.$router.push(path);
        }
    }
};
</script>

<style lang="scss" module>
.footer {
    position: fixed;
    bottom: 0;
    z-index: 900;
    width: 100%;
    height: 45px;
    background: #393939;
    overflow: hidden;

    ul, li {
        list-style: none;
        margin: 0;
        padding: 0;
    }
}

.footer-item {
    width: 25%;
    height: 100%;
    position: relative;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    float: left;
    color: #F8F1EB;

    .icon {
        width: 24px;
        height: 24px;
        margin: 4px auto -5px;
        display: block;
        background-size: 100%;
        background-repeat: no-repeat;

        &.icon-home {
            background-image: url('/static/image/mobile/tpl/theme3/footer/home.png');
        }

        &.icon-promotion {
            background-image: url('/static/image/mobile/tpl/theme3/footer/promotion.png');
        }

        &.icon-service {
            background-image: url('/static/image/mobile/tpl/theme3/footer/service.png');
        }

        &.icon-mcenter, &.icon-login {
            background-image: url('/static/image/mobile/tpl/theme3/footer/mcenter.png');
        }
    }

    &.active {
        color: #EFD497;

        .icon-home {
            background-image: url('/static/image/mobile/tpl/theme3/footer/home-active.png');
        }

        .icon-promotion {
            background-image: url('/static/image/mobile/tpl/theme3/footer/promotion-active.png');
        }

        .icon-service {
            background-image: url('/static/image/mobile/tpl/theme3/footer/service-active.png');
        }

        .icon-mcenter, .icon-login {
            background-image: url('/static/image/mobile/tpl/theme3/footer/mcenter-active.png');
        }
    }

    span {
        font-size: 12px;
        text-align: center;
        display: block;
    }
}
</style>
