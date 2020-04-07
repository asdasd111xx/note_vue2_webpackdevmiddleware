<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['page-container']">
            <div
                v-for="(link, index) in linkArr"
                :key="`link-${index}`"
                :class="$style['img-wrap']"
                @click="changePage(link)"
            >
                <img :class="$style['img-out']" :src="`/static/image/tpl/customizeHome/70/body/game0${index + 1}_over.png`" />
                <img :class="$style['img-in']" :src="`/static/image/tpl/customizeHome/70/body/game0${index + 1}.png`"/>
            </div>
        </div>
    </div>
</template>

<script>
import navData from '@/lib/nav_data';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            navData: {}
        };
    },
    computed: {
        linkArr() {
            const linkData = {};

            this.navData.navArr.forEach((nav) => {
                if (nav.pid === 13725) { // 體育賽事
                    linkData.sports = nav.pid || nav;
                }

                if (nav.pid === 13727) { // 視訊
                    linkData.live = nav.pid || nav;
                }

                if (nav.pid === 13731) { // 電子
                    linkData.casino = nav.pid || nav;
                }

                if (nav.pid === 13737) { // 棋牌
                    linkData.card = nav.pid || nav;
                }
            });

            return [
                linkData.sports, // 體育
                linkData.live, // 視訊
                linkData.casino, // 電子
                's128', // 鬥雞
                linkData.card // 棋牌
            ];
        }
    },
    created() {
        this.navData = navData();
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(page) {
            if (this.isBackEnd) {
                return;
            }

            if (page === 's128') {
                this.actionChangePage({ page, type: 'games' });
            }

            this.actionChangePage({ page, type: 'custom' });
        }
    }
};
</script>

<style lang="scss" src="../css/game.module.scss" module></style>
