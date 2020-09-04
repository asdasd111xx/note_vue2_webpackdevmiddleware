<template>
    <div class="news-content-wrap">
        <components
            :is="`theme${theme}`"
            v-if="newsData.length !== 0"
            :data="newsData"
            :duration="speed"
            :direction="direction"
            :view-full-content="viewFullContent"
            :toggle-popup="togglePopup"
            :custom-event="customEvent"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

/**
 * 共用元件 - 最新消息
 * @param {String} [theme=1] - 樣式; 值：1
 * @param {String} [dataSource=mem] - 最新消息資料來源; 值：mem、agent
 * @param {Number} [speed=20] - 移動速度, 越小越快
 * @param {String} [direction=left] - 移動方向; 值：left、right、up、down
 * @param {Boolean} [viewFullContent=true] - 點擊查看細項功能
 * @param {Function} [customEvent=() => {}] - 客製事件
 */
export default {
    components: {
        theme1: () => import(/* webpackChunkName: 'theme1' */'./template/theme1')
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
            default: 20
        },
        direction: {
            type: String,
            default: 'left'
        },
        viewFullContent: {
            type: Boolean,
            default: true
        },
        customEvent: {
            type: Function,
            default: null
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            newsPopControl: 'getNewsPopControl',
            memNewsData: 'getNews',
            agentNewsData: 'getAgentNews'
        }),
        newsData() {
            return this.dataSource === 'mem' ? this.memNewsData : this.agentNewsData;
        }
    },
    methods: {
        ...mapActions([
            'actionNewsPopControl'
        ]),
        // 開啟最新消息方式
        togglePopup(params) {
            console.log('w2323ds', this.viewFullContent, this.customEvent, this.dataSource, this.newsPopControl.status);
            if (this.isBackEnd || !this.viewFullContent) {
                return;
            }

            if (this.customEvent) {
                this.customEvent(params, this.dataSource);
                return;
            }

            this.actionNewsPopControl({ type: this.dataSource, status: !this.newsPopControl.status });
        }
    }
};
</script>
