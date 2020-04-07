<template>
    <components
        :is="curTemplate"
        :nav-change-page="navChangePage"
        :list-select="listSelect"
        :list-switch="listSwitch"
        :is-current="$route.params.subId"
    />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        themeBasic: () => import(/* webpackChunkName: 'themeBasic' */'./template/themeBasic'),
        themeBrilliant: () => import(/* webpackChunkName: 'themeBrilliant' */'./template/themeBrilliant'),
        theme3: () => import(/* webpackChunkName: 'theme3' */'./template/theme3'),
        themeMiller: () => import(/* webpackChunkName: 'themeMiller' */'./template/themeMiller')
    },
    props: {
        navChangePage: {
            type: Function,
            default: () => {}
        },
        listSelect: {
            type: Function,
            default: () => {}
        },
        isCurrent: {
            type: String,
            default: ''
        },
        listSwitch: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            webInfo: 'getWebInfo'
        }),
        curTemplate() {
            if (this.siteConfig.MCENTER_COLOR === '519') {
                return 'theme-basic';
            }

            if (this.siteConfig.MCENTER_COLOR === 'theme3') {
                return 'theme3';
            }

            if (this.siteConfig.MCENTER_COLOR === 'miller') {
                return 'theme-miller';
            }

            return `theme-${this.siteConfig.MCENTER_COLOR}`;
        }
    }
};
</script>
