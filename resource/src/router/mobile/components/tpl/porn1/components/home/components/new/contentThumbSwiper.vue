<template>
    <swiper
        class="swiper gellery-content"
        :options="swiperOptionContent"
        :style="contentDivHeight"
    >
        <swiper-slide>
            <div class="content-cells" v-for="(item, index) in 2" :key="index">
                <div class="desc">
                    <div class="title">
                        <img
                            :src="
                                $getCdnPath(
                                    '/static/image/_new/common/icon_item.png'
                                )
                            "
                            alt="icon_item"
                        />
                        <span>热门推荐</span>
                    </div>
                    <div class="more">更多</div>
                </div>
                <div class="content">
                    <div
                        class="content-cell-block"
                        v-for="(item, index) in 4"
                        :key="index"
                    >
                        <img
                            :src="
                                $getCdnPath(
                                    '/static/image/_new/platform/card/slot/short/agcasino_short.png'
                                )
                            "
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </swiper-slide>
        <swiper-slide v-for="(item, index) in 11" :key="index">
            <div class="content-cells">
                <div class="content">
                    <div
                        class="content-cell-block"
                        v-for="(item, index) in 4"
                        :key="index"
                    >
                        <img
                            :src="
                                $getCdnPath(
                                    '/static/image/_new/platform/card/slot/short/agcasino_short.png'
                                )
                            "
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </swiper-slide>
    </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { mapGetters } from "vuex";
import axios from "axios";
import game from "@/api/game";
import querystring from "querystring";
import { API_PORN1_DOMAIN } from "@/config/api";

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        contentDivHeight: {
            type: Object,
            required: true
        },
        isVideoPage: {
            type: Boolean,
            required: true
        },
        selectedIndex: {
            type: Number,
            required: true
        },
        videoTab: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            video: { id: 0, title: "" },
            videoRecommand: [],
            videoList: [],
            videoSort: [],
            allWinGame: []
        };
    },
    computed: {
        ...mapGetters({
            gameData: "getGameData"
        }),
        swiperOptionContent() {
            return {
                loop: true,
                loopAdditionalSlides: 6,
                loopedSlides: 6, // looped slides should be the same
                spaceBetween: 10,
                direction: "vertical",
                freeMode: true,
                mousewheel: true,
                // 自適應內容的高度: autoHeight + slidesPerView 必備
                autoHeight: true,
                slidesPerView: "auto",
                thumbs: {
                    swiper: this.$parent.$refs.swiperThumbs.$el.swiper
                },
                on: {
                    // init: () => {
                    //     this.$emit("update:selectedIndex", 0);
                    // }
                    slideChange: () => {
                        this.$emit(
                            "update:selectedIndex",
                            this.$parent.$refs.swiperContent.$el.swiper
                                .realIndex
                        );
                    }
                }
            };
        },
        hallList() {
            if (this.hallTab === "lottery") {
                const data = find(
                    this.hallList,
                    info => info.vendor === this.hallTab
                );
                const gameList = this.allWinGame.filter(
                    value => !data.list.includes(value)
                );

                data.list = gameList.concat(data.list);

                return [{ ...data }];
            }
            return [
                { ...find(this.hallList, info => info.vendor === this.hallTab) }
            ];
        },
        avList() {
            if (!this.videoList.length) {
                return [];
            }

            // 「全部」以外的tag進入此function
            if (this.videoTab.id) {
                return this.videoSort.reduce((init, sort) => {
                    const data = find(
                        this.videoList,
                        info => info.id === sort.id
                    );

                    if (!data) {
                        return init;
                    }

                    return [...init, { ...data }];
                }, []);
            }

            return this.videoSort.reduce(
                (init, sort) => {
                    const data = find(
                        this.videoList,
                        info => info.id === sort.id
                    );

                    if (!data) {
                        return init;
                    }

                    return [...init, { ...data }];
                },
                [...this.videoRecommand]
            );
        }
    },
    watch: {
        videoTab() {
            this.getList();
        },
        selectedIndex() {
            if (this.selectedIndex !== 0) {
                this.$emit("update:isVideoPage", false);
            } else {
                this.$emit("update:isVideoPage", true);
            }
        }
    },
    created() {
        this.getSort();
        this.getRecommand();
        this.getList();
        if (this.gameData.allwin.switch === "Y") {
            this.getAllWin();
        }
    },

    methods: {
        getSort() {
            axios({
                method: "get",
                url: `${API_PORN1_DOMAIN}/api/v1/video/sort`,
                timeout: 30000,
                headers: {
                    // Bundleid: "chungyo.foxyporn.prod.enterprise.web",
                    // Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    "Content-Type": "application/x-www-form-urlencoded",
                    origin: "http://127.0.0.1"
                }
            }).then(response => {
                if (response.status !== 200) {
                    return;
                }

                this.videoSort = [...response.data.result];
                console.log("getSort :", this.videoSort);
            });
        },
        getRecommand() {
            axios({
                method: "get",
                url: `${API_PORN1_DOMAIN}/api/v1/video/recommand`,
                timeout: 30000,
                headers: {
                    // Bundleid: "chungyo.foxyporn.prod.enterprise.web",
                    // Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    "Content-Type": "application/x-www-form-urlencoded",
                    origin: "http://127.0.0.1"
                }
            }).then(response => {
                if (response.status !== 200) {
                    return;
                }

                this.videoRecommand = [...response.data.result];
                console.log("getRecommand :", this.videoRecommand);
            });
        },
        getList() {
            axios({
                method: "post",
                url: `${API_PORN1_DOMAIN}/api/v1/video/videolist`,
                timeout: 30000,
                data: querystring.stringify({ tag: this.videoTab.title }),
                headers: {
                    // Bundleid: "chungyo.foxyporn.prod.enterprise.web",
                    // Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    "Content-Type": "application/x-www-form-urlencoded",
                    origin: "http://127.0.0.1"
                }
            }).then(response => {
                if (response.status !== 200) {
                    return;
                }

                this.videoList = [...response.data.result];
                console.log("getList :", this.videoList);
            });
        },
        getAllWin() {
            // 500萬彩票要加遊戲入口共三款
            game.gameListByAssign({
                params: {
                    kind: 4,
                    vendor: "allwin",
                    max_results: 3,
                    enable: true
                },
                success: response => {
                    response.ret.forEach(info => {
                        const list = {
                            ...info,
                            is_game: true
                        };

                        this.allWinGame.push(list);
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 5px;
$main-color: #b1987f;
$main-linear-background: linear-gradient(#bd9d7d, #f9ddbd);
$animation-time: 1s;

.gellery-content {
    position: relative;
    width: calc(100% - 70px);
    left: 70px;
    margin: 0;
}

.content-cells {
    position: relative;
    font-size: 14px;

    .desc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0px;
        color: #be9e7f;

        .more {
            border-radius: $border-radius;
            font-size: 14px;
            padding: 2.5px 17.5px;
            color: white;
            background: $main-linear-background;
        }
    }

    .content {
        position: relative;
        width: 100%;
        height: auto;
    }

    .content-cell-block {
        display: inline-block;
        width: 49%;
        height: 120px;
        margin: 0 1px;

        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
