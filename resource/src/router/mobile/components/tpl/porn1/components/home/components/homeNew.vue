<template>
    <div class="news-wrap">
        <div class="news-icon">
            <img :src="$getCdnPath('/static/image/_new/common/icon_news.png')" />
        </div>
        <marquee
            :direction="direction"
            :scrolldelay="speed"
            :onmouseover="viewFullContent ? 'this.stop()' : ''"
            :onmouseout="viewFullContent ? 'this.start()' : ''"
            class="news-content"
            @click="togglePopup"
        >
            <span v-for="(item, index) in newsData" :key="index">
                {{ item.content }} &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
        </marquee>
        <template v-if="newsPopControl.status">
            <div class="mask" />
            <div class="modal-wrap">
                <div class="modal-content">
                    <div class="modal-news">
                        <div
                            v-for="(item, sort) in newsData"
                            :key="`news-${sort}`"
                            class="news-item"
                        >
                            <h4 class="news-title">{{ item.time }}</h4>
                            <p class="news-text">{{ item.content }}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-button" @click="togglePopup">
                    关闭
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
    },
    props: {
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
            default: () => { }
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

            document.querySelector('body').style = !this.newsPopControl.status ? 'overflow: hidden' : '';

            this.actionNewsPopControl({ type: this.dataSource, status: !this.newsPopControl.status });
        }
    }
};
</script>

<style lang="scss" scoped>
.news-wrap {
    display: flex;
    align-content: center;
    padding: 10px 17px 8px;

    .news-icon {
        height: 100%;
        width: 15px;
    }

    .news-icon > img {
        display: block;
        width: 15px;
        height: 12px;
    }
}
.news-content {
    display: block;
    cursor: pointer;
    white-space: nowrap;
    line-height: 12px;
    margin-left: 6px;
    color: #9CA3BF;
    font-size: 12px;
}

.mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
}


.modal-wrap {
    width: 270px;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 100;
    transform: translate(-50%, -50%);
    background: #FFF;
    border-radius: 10px;
}

.modal-content {
    padding: 15px 20px;
    border-bottom: 1px solid #EEE;
}

.modal-news {
    min-height: 170px;
    max-height: 190px;
    overflow-x: hidden;
    overflow-y: auto;
}

.news-item {
    margin-top: 20px;
    word-break: break-all;

    &:first-child {
        margin-top: 0;
    }
}

.news-title {
    line-height: 23px;
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: normal;
    color: #414655;
}

.news-text {
    line-height: 21px;
    font-size: 14px;
    color: #A5A9B3;
}

.modal-button {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
}
</style>
