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
        <div ref="content-wrap" class="content-wrap">
            <func-Block :selected-index="selectedIndex" :video-tab.sync="videoTab" />
            <content-thumb-swiper
                v-if="hallTabHasCreated && contentStyle"
                ref="swiperContent"
                :content-style="contentStyle"
                :hall-tab="hallTab"
                :video-tab="videoTab"
                :selected-index.sync="selectedIndex"
                :all-game="allGame"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
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
            contentStyle: null,
            selectedIndex: 0,
            video: { id: 0, title: '' },
            allGame: []
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        videoTab: {
            get() {
                return this.video;
            },
            set(value) {
                this.video = { ...value };
            }
        },
        hallTab() {
            return [{ icon: 'Tv', name: '影片' }, ...this.allGame.map((game) => ({ icon: game.iconName, name: game.name }))];
        }
    },
    created() {
        this.getGame();
    },
    mounted() {
        window.addEventListener('resize', this.onResize);

        // 故意使用setTimeout等首頁輪播圖載入完畢，才能正確取得offsetTop
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    },
    methods: {
        getGame() {
            axios({
                method: 'get',
                url: `${this.siteConfig.YABO_API_DOMAIN}/game/list`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    origin: 'http://127.0.0.1'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.allGame = [...response.data.data];
            });
        },
        onResize() {
            const height = window.innerHeight - this.$refs['content-wrap'].offsetTop - 50 - 60;
            this.contentStyle = { height: `${height}px` };
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 5px;
$main-color: #b1987f;
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
