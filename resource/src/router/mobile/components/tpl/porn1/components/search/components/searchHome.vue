<template>
    <div :class="$style['discover-tag-wrap']">
        <div :class="$style['banner-wrap']">
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/search/banner.png')" />
        </div>
        <div :class="$style['search-wrap']">
            <input
                v-model="keyWord"
                :placeholder="$text('S_PLEASE_INPUT_AV', '请输入片名、女优或番号')"
                type="text"
                @keydown.enter="onClick({ title: keyWord })"
            />
            <div :class="$style['icon-search']" @click="onClick({ title: keyWord })">
                <icon
                    name="search"
                    width="20"
                    height="20"
                />
            </div>
        </div>
        <div v-if="historyList.length" :class="$style.history">
            <div :class="$style.title">{{ $text('S_SEARCH_HISTORY', '历史搜寻') }}</div>
            <div :class="$style['icon-trash']" @click="onDelete" />
            <div :class="[$style['history-search'], 'clearfix']">
                <div
                    v-for="(title, index) in historyList"
                    :key="`key-word-${index}`"
                    :class="$style.wrap"
                    @click="onClick({ title })"
                >
                    <span>{{ title }}</span>
                </div>
            </div>
        </div>
        <div :class="$style.hot">
            <div :class="$style.title">{{ $text('S_SEARCH_HOT', '热门搜寻') }}</div>
            <div :class="[$style['hot-search'], 'clearfix']">
                <div
                    v-for="info in hotList"
                    :key="info.id"
                    :class="$style.wrap"
                    @click="onClick(info)"
                >
                    <span>{{ info.title }}</span>
                </div>
            </div>
        </div>
        <div :class="$style.recommend">
            <div :class="$style.title">{{ $text('S_RECOMMANDED', '推荐') }}</div>
            <div :class="[$style['recommend-search'], 'clearfix']">
                <div
                    v-for="info in recommendList"
                    :key="info.id"
                    :class="$style.wrap"
                    @click="onClick(info)"
                >
                    <span>{{ info.title }}</span>
                </div>
            </div>
        </div>
        <div :class="$style.tips">
            <span>{{ $text('S_ADULT_VIDEO_TIPS', '车牌又叫电影番号或编号。在爱情动作电影的故乡岛国，老师将同学们喜爱的各形各色的爱情动作片按厂商、制作风、有无码、质量参数、发表时间、版本等特征性的内容编码分类。车牌是经验老道的老司机们对电影番号的另外壹种充满爱的诠释。') }}</span>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import split from 'lodash/split';
import join from 'lodash/join';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    props: {
        setKeyWord: {
            type: Function,
            required: true
        }
    },
    data() {
        const historyKeyWord = localStorage.getItem('history-search');

        return {
            historyList: historyKeyWord ? split(historyKeyWord, ',') : [],
            hotList: [],
            recommendList: [],
            keyWord: ''
        };
    },
    created() {
        axios({
            method: 'get',
            url: `${API_PORN1_DOMAIN}/api/v1/video/getsearchkey`,
            timeout: 30000,
            headers: {
                Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                Version: 1
                // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // origin: 'http://127.0.0.1'
            }
        }).then((response) => {
            if (response.data.status !== 200) {
                return;
            }

            this.hotList = [...response.data.result.hot];
            this.recommendList = [...response.data.result.recommend];
        });
    },
    methods: {
        onClick({ title }) {
            const historyKeyWord = this.historyList.includes(title) ? [...this.historyList] : [...this.historyList, title];

            localStorage.setItem('history-search', join(historyKeyWord));

            this.setKeyWord(title);
            this.$router.push({ name: 'search', params: { key: title } });
        },
        onDelete() {
            this.historyList = [];

            localStorage.removeItem('history-search');
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.discover-tag-wrap {
    padding: 10px 15px 12px;
}

.banner-wrap {
    margin-bottom: 20px;

    > img {
        display: block;
        width: 100%;
    }
}

.search-wrap {
    position: relative;
    margin-bottom: 20px;

    > input {
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0 64px 0 16px;
        border: none;
        border-radius: 16px;
        background-color: #393A44;
        color: #7A7D85;
        font-size: 13px;
        outline: none;
    }
}

.icon-search {
    position: absolute;
    top: 0;
    right: 0;
    width: 48px;
    height: 32px;
    padding: 6px 0;
    border-radius: 0 16px 16px 0;
    background-color: #F9CF33;
    color: #EA377E;

    > svg {
        display: block;
        margin: 0 auto;
    }
}

.history,
.hot,
.recommend {
    margin-bottom: 15px;
}

.history  {
    position: relative;

    .wrap {
        color: #9A9DA4;
    }
}

.hot,
.recommend {
    .wrap {
        color: #FFAF3F;
    }
}

.title {
    height: 30px;
    line-height: 30px;
    color: #FFF;
    font-weight: 700;
    font-size: 15px;
}

.icon-trash {
    position: absolute;
    top: 4px;
    right: 0;
    width: 22px;
    height: 22px;
    background: url('/static/image/mobile/tpl/porn1/search/icon_trash.png') 50% 50% no-repeat;
    background-size: 22px 22px;
}

.history-search,
.hot-search,
.recommend-search {
    margin-top: 15px;
}

.wrap {
    overflow: hidden;
    float: left;
    width: 22%;
    height: 28px;
    line-height: 28px;
    margin: 0 4% 15px 0;
    padding: 0 3px;
    border-radius: 14px;
    background-color: #242630;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:nth-child(4n) {
        margin-right: 0;
    }
}

.tips {
    height: 75px;
    line-height: 15px;
    padding-right: 24px;
    background: url('/static/image/mobile/tpl/porn1/search/lesson.png') 100% 50% no-repeat;
    background-size: 20px 71px;
    color: #5B5D6C;
    font-weight: 500;
    font-size: 12px;

    &::before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }

    > span {
        display: inline-block;
        vertical-align: middle;
    }
}

@media screen and (min-width: $phone) {
    .wrap {
        font-size: 14px;
    }

    .title {
        font-size: 16px;
    }
}

@media screen and (min-width: $pad) {
    .search-wrap {
        > input {
            font-size: 14px;
        }
    }

    .wrap {
        font-size: 16px;
    }

    .title {
        font-size: 18px;
    }

    .tips {
        font-size: 14px;
    }
}
</style>
