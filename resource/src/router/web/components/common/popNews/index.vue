<template>
    <transition v-if="newsPopControl.status" name="pop">
        <div :class="mainClass">
            <div class="mask" @click="togglePopup(false)" />
            <div class="pop-news-wrap">
                <div class="pop-news-container">
                    <div class="close-btn" @click="togglePopup(false)">×</div>
                    <div class="title">{{ $t('S_HOT_NEWS_2') }}</div>
                    <div class="content-wrap">
                        <div
                            v-for="(item, index) in data"
                            :key="`pop-news-list${index}`"
                            class="content"
                        >
                            <div class="content-title">{{ item.time }}</div>
                            <!-- v-html 會導致 [html tag] 直接顯示樣式，因此改為 v-text -->
                            <div class="content-detail" v-text="item.content" />
                        </div>
                    </div>
                </div>
            </div>
            <v-style :style-data="styleData" />
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        const styleData = {
            common: [
                {
                    // eslint-disable-next-line
                    className: `.pop-wrap.is-519[${this.$options._scopeId}]`,
                    path: '/static/image/tpl/customizeHome/27/news01/default/news_pop_bg01.png'
                },
                {
                    // eslint-disable-next-line
                    className: `.pop-wrap.is-519 .pop-news-wrap .close-btn[${this.$options._scopeId}]`,
                    path: '/static/image/tpl/customizeHome/27/news01/default/news_pop_icon01.png'
                },
                {
                    // eslint-disable-next-line
                    className: `.pop-wrap.is-519 .pop-news-wrap .close-btn[${this.$options._scopeId}]:hover`,
                    path: '/static/image/tpl/customizeHome/27/news01/default/news_pop_icon01_hover.png'
                },
                {
                    // eslint-disable-next-line
                    className: `.pop-wrap.is-519 .pop-news-wrap .content-title[${this.$options._scopeId}]`,
                    path: '/static/image/tpl/customizeHome/27/news01/default/news_pop_bg02.png'
                }
            ]
        };

        return {
            styleData
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            newsPopControl: 'getNewsPopControl',
            memNewsData: 'getNews',
            agentNewsData: 'getAgentNews'
        }),
        mainClass() {
            return {
                'pop-wrap': true,
                'is-normal': !['27', '185'].includes(this.webInfo.alias),
                'is-519': ['27', '185'].includes(this.webInfo.alias)
            };
        },
        data() {
            return (this.newsPopControl.type === 'mem') ? this.memNewsData : this.agentNewsData;
        }
    },
    methods: {
        ...mapActions([
            'actionNewsPopControl'
        ]),
        togglePopup() {
            this.actionNewsPopControl({ status: false });
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
