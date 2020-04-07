<template>
    <div class="home-content-wrap">
        <mcenter v-if="hallTab !== 'home'" />
        <template v-for="(info, index) in list">
            <hall-view
                v-if="info.vendor"
                :key="index"
                :hall-info="info"
                :hall-tab="hallTab"
            />
            <video-view
                v-else
                :key="index"
                :video-info="info"
                :video-tab="videoTab"
            />
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import querystring from 'querystring';
import find from 'lodash/find';
import game from '@/api/game';
import mcenter from './mcenter';
import videoView from './videoView';
import hallView from './hallView';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    components: {
        videoView,
        hallView,
        mcenter
    },
    props: {
        hallList: {
            type: Array,
            required: true
        },
        hallTab: {
            type: String,
            required: true
        },
        videoTab: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isReceive: false,
            videoRecommand: [],
            videoList: [],
            videoSort: [],
            allWinGame: []
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData'
        }),
        list() {
            if (this.hallTab !== 'home') {
                if (this.hallTab === 'lottery') {
                    const data = find(this.hallList, (info) => info.vendor === this.hallTab);
                    const gameList = this.allWinGame.filter((value) => !data.list.includes(value));

                    data.list = gameList.concat(data.list);

                    return [{ ...data }];
                }
                return [{ ...find(this.hallList, (info) => info.vendor === this.hallTab) }];
            }

            if (!this.videoList.length) {
                return [];
            }

            let hallIndex = 0;

            if (this.videoTab.id) {
                return this.videoSort.reduce((init, sort) => {
                    const { length } = this.hallList;
                    const i = hallIndex % length;
                    const data = find(this.videoList, (info) => info.id === sort.id);

                    if (!data) {
                        return init;
                    }

                    const hall = this.hallList[i];

                    hallIndex += 1;

                    return [...init, { ...data }, { ...hall }];
                }, []);
            }

            return this.videoSort.reduce((init, sort) => {
                const { length } = this.hallList;
                const i = hallIndex % length;
                const data = find(this.videoList, (info) => info.id === sort.id);

                if (!data) {
                    return init;
                }

                const hall = this.hallList[i];

                if (hall.vendor === 'lottery') {
                    const gameList = this.allWinGame.filter((value) => !hall.list.includes(value));
                    hall.list = gameList.concat(hall.list);
                }

                hallIndex += 1;

                return [...init, { ...hall }, { ...data }];
            }, [...this.videoRecommand]);
        }
    },
    watch: {
        videoTab() {
            this.getList();
        }
    },
    created() {
        this.getSort();
        this.getRecommand();
        this.getList();

        if (this.gameData.allwin.switch === 'Y') {
            this.getAllWin();
        }
    },
    methods: {
        getSort() {
            axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/sort`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    // origin: 'http://127.0.0.1'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoSort = [...response.data.result];
            });
        },
        getRecommand() {
            axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/recommand`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    // origin: 'http://127.0.0.1'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoRecommand = [...response.data.result];
            });
        },
        getList() {
            axios({
                method: 'post',
                url: `${API_PORN1_DOMAIN}/api/v1/video/videolist`,
                timeout: 30000,
                data: querystring.stringify({ tag: this.videoTab.title }),
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    // origin: 'http://127.0.0.1'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoList = [...response.data.result];
            });
        },
        getAllWin() {
            // 500萬彩票要加遊戲入口共三款
            game.gameListByAssign({
                params: {
                    kind: 4,
                    vendor: 'allwin',
                    max_results: 3,
                    enable: true
                },
                success: (response) => {
                    response.ret.forEach((info) => {
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
