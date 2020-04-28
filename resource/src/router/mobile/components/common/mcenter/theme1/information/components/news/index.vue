<template>
    <div v-if="newsData.length === 0" :class="$style['no-data']">
        <div :class="$style['no-data-wrap']">
            <img :src="$getCdnPath('/static/image/_new/mcenter/information/no_message.png')" />
            <div>还没有新的消息</div>
        </div>
    </div>
    <div v-else :class="$style['news-wrap']">
        <div v-if="$route.params.pid" :class="$style['news-content']">
            <div :class="[$style['content-title'], 'clearfix']">
                <div :class="$style['icon-news']">
                    <img :src="$getCdnPath('/static/image/_new/mcenter/information/icon_information.png')" />
                </div>
                <div :class="$style.wrap">
                    <div :class="$style.date">{{ currentNews.time | dateFormat }}</div>
                    <div :class="$style.time">{{ currentNews.time | timeFormat }}</div>
                </div>
            </div>
            <div :class="$style['content-wrap']" v-html="currentNews.content" />
        </div>
        <div v-else :class="$style['news-list']">
            <div
                v-for="news in newsData"
                :key="news.id"
                :class="[$style.news, 'clearfix']"
                @click="$router.push({ params: { pid: news.id } })"
            >
                <div :class="$style['icon-news']">
                    <img :src="$getCdnPath('/static/image/_new/mcenter/information/icon_information.png')" />
                </div>
                <div :class="$style.wrap">
                    <div :class="$style.date">{{ news.time | dateFormat }}</div>
                    <div :class="$style.content" v-html="news.content" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default {
    filters: {
        dateFormat(date) {
            return Vue.moment(date).format('YYYY-MM-DD');
        },
        timeFormat(date) {
            return Vue.moment(date).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    computed: {
        ...mapGetters({
            newsData: 'getNews'
        }),
        currentNews() {
            if (!this.$route.params.pid) {
                return null;
            }
            return this.newsData.find((news) => news.id === this.$route.params.pid);
        }
    }
};
</script>

<style lang="scss" module>
.no-data {
    position: relative;
    min-height: calc(100vh - 43px - 42px - 10px);
    margin-top: 52px;
    background-color: #FEFFFE;
}

.no-data-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 180px;
    height: 220px;
    margin: auto;

    > img {
        display: block;
        width: 100%;
    }

    > div {
        height: 20px;
        line-height: 20px;
        margin-top: 20px;
        color: #A5A9B3;
        font-size: 14px;
        text-align: center;
    }
}

.news-wrap {
    background-color: #FEFFFE;
}

.news-list {
    min-height: calc(100vh - 43px - 42px - 10px);
    margin-top: 52px;
}

.news-content {
    min-height: calc(100vh - 43px - 10px);
    margin-top: 10px;
}

.content-title {
    padding-left: 14px;

    .icon-news {
        margin: 13px 0;
    }

    .wrap {
        padding: 10px 0;
        border-bottom: 1px solid #EEE;
    }
}

.icon-news {
    position: relative;
    float: left;
    width: 32px;
    height: 32px;

    > img {
        display: block;
        width: 100%;
    }

    > span {
        position: absolute;
        top: 0;
        right: 0;
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #DB6372;
    }
}

.news {
    height: 67px;
    margin: 0 7px;
    padding: 0 7px;
    border-bottom: 1px solid #EEE;
    background-color: #FEFFFE;

    .icon-news {
        margin: 17px 0;
    }

    .wrap {
        padding: 13px 0;
    }
}

.icon-news {
    position: relative;
    float: left;
    width: 32px;
    height: 32px;

    > img {
        display: block;
        width: 100%;
    }
}

.wrap {
    float: left;
    width: calc(100% - 32px - 10px);
    margin-left: 10px;

    p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.content-wrap {
    padding: 8px 18px;
    color: #414655;
    font-size: 14px;
}

.date {
    height: 20px;
    line-height: 20px;
    color: #414655;
    font-size: 14px;
}

.time {
    height: 12px;
    line-height: 12px;
    margin-top: 6px;
    color: #A6A9B2;
    font-size: 12px;
}

.content {
    height: 17px;
    line-height: 17px;
    margin-top: 3px;
    color: #A6A9B2;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
