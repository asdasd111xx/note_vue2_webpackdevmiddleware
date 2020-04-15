<template>
    <div class="home-content-container clearfix">
        <div class="hall-wrap">
            <hall-thumb-swiper
                ref="swiperThumbs"
                :hall-tab="hallTab"
                :selected-index="selectedIndex"
                :hall-tab-has-created.sync="hallTabHasCreated"
            />
        </div>
        <div class="content-wrap">
            <func-Block :selected-index="selectedIndex" :video-tab.sync="videoTab" />
            <content-thumb-swiper
                v-if="hallTabHasCreated"
                ref="swiperContent"
                :hall-tab="hallTab"
                :video-tab="videoTab"
                :selected-index.sync="selectedIndex"
            />
        </div>
    </div>
</template>

<script>
import funcBlock from './funcBlock';
import hallThumbSwiper from './hallThumbSwiper';
import contentThumbSwiper from './contentThumbSwiper';

export default {
    name: 'HomeContent',
    components: {
        funcBlock,
        hallThumbSwiper,
        contentThumbSwiper
    },
    data() {
        return {
            hallTabHasCreated: false,
            selectedIndex: 0,
            video: { id: 0, title: '' }
        };
    },
    computed: {
        videoTab: {
            get() {
                return this.video;
            },
            set(value) {
                this.video = { ...value };
            }
        },
        hallTab() {
            return [
                { title: '影片', category: 'tv' },
                { title: '捕鱼', category: 'fish' },
                { title: '牛牛', category: 'bubu' },
                { title: '麻将', category: 'mahjong' },
                { title: '电子', category: 'slots' },
                { title: '棋牌', category: 'card' },
                { title: '电竞', category: 'e-sports' },
                { title: '真人', category: 'live' },
                { title: '彩票', category: 'lottery' },
                { title: '体育', category: 'sport' },
                { title: '代理', category: 'agents' },
                { title: '直播', category: 'live-stream' }
            ];
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 5px;
$main-color: #b1987f;
$main-linear-background: linear-gradient(#bd9d7d, #f9ddbd);
$animation-time: 1s;

.home-content-container {
    margin: 0 17px;
}

.hall-wrap {
    float: left;
    width: 63px;
    margin-right: 1px;
}

.content-wrap {
    float: right;
    width: calc(100% - 63px - 1px);
}
</style>
