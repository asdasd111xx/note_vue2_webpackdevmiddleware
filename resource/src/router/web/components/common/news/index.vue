<template>
    <div>
        <theme1
            v-if="theme === '1'"
            :class="commonClass"
            :data="newsData"
            :speed="speed"
            :direction="direction"
            :view-full-content="viewFullContent"
            :toggle-popup="togglePopup"
            :update-news="updateNews"
        />
        <theme2
            v-if="theme === '2'"
            :class="commonClass"
            :data="newsData"
            :speed="speed"
            :direction="direction"
            :view-full-content="viewFullContent"
            :toggle-popup="togglePopup"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

/**
 * 共用元件 - 最新消息
 * @param {String} [theme=1] - 樣式; 值：1
 * @param {String} [dataSource=mem] - 最新消息資料來源; 值：mem,agent
 * @param {Number} [speed=85] - 移動速度
 * @param {String} [direction=left] - 移動方向; 值：left、right、up、down
 * @param {Boolean} [viewFullContent=true] - 點擊查看細項功能
 */
export default {
    components: {
        theme1: () => import(/* webpackChunkName: 'theme1' */'./template/theme1'),
        theme2: () => import(/* webpackChunkName: 'theme1' */'./template/theme2/')
    },
    props: {
        theme: {
            type: String,
            default: '1'
        },
        dataSource: {
            type: String,
            default: 'mem'
        },
        speed: {
            type: Number,
            default: 85
        },
        direction: {
            type: String,
            default: 'left'
        },
        viewFullContent: {
            type: Boolean,
            default: true
        },
        updateNews: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            commonClass: ['news-content-wrap', 'clearfix']
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            newsPopControl: 'getNewsPopControl',
            memNewsData: 'getNews',
            agentNewsData: 'getAgentNews'
        }),
        newsData() {
            return (this.dataSource === 'mem') ? this.memNewsData : this.agentNewsData;
        }
    },
    methods: {
        ...mapActions([
            'actionNewsPopControl'
        ]),
        // 開啟最新消息方式
        togglePopup() {
            if (this.isBackEnd || !this.viewFullContent) {
                return;
            }

            this.actionNewsPopControl({ type: this.dataSource, status: !this.newsPopControl.status });
        }
    }
};
</script>
