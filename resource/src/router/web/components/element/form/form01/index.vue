<template>
    <!-- 聯絡我們 -->
    <main-wrap
        v-if="isReady"
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
    >
        <theme-default
            :element="element"
            :config="config"
            :system-email-state="systemEmailState"
        />
    </main-wrap>
</template>

<script>
import { mapGetters } from 'vuex';
import config from './config';
import themeDefault from './template/themeDefault';

export default {
    components: {
        mainWrap: () => import(/* webpackChunkName: 'mainWrap' */'../../common/new/mainWrap'),
        themeDefault
    },
    props: {
        element: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            config,
            systemEmailState: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo'
        }),
        isReady() {
            return this.isBackEnd || this.systemEmailState;
        }
    },
    created() {
        if (!this.isBackEnd) {
            this.systemEmailState = this.memInfo.config.has_recipient;
            return;
        }

        this.systemEmailState = process.env.NODE_ENV !== 'development' ? this.memInfo.config.recipient !== '' : true;
    }
};
</script>
