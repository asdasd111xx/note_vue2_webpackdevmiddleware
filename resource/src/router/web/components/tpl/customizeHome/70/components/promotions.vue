<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['page-container']">
            <div
                v-for="num in 4"
                :key="`img-${num}`"
                :class="$style['img-wrap']"
                @click="changePage(promotionData)"
            >
                <img :class="$style['img-out']" :src="`/static/image/tpl/customizeHome/70/body/first_promotion_item0${num}_over.png`" />
                <img :class="$style['img-in']" :src="`/static/image/tpl/customizeHome/70/body/first_promotion_item0${num}.png`" />
            </div>
            <img
                :class="$style['add-btn']"
                :src="$getCdnPath('/static/image/tpl/customizeHome/70/body/firtst_promotion_more_btn.png')"
                @click="changePage(promotionData)"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import navData from '@/lib/nav_data';

export default {
    data() {
        return {
            navData: {}
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        }),
        promotionData() {
            let data;
            this.navData.navArr.forEach((nav) => {
                if (nav.navPage === 'promotion') {
                    data = nav;
                }
            });

            return data;
        }
    },
    created() {
        this.navData = navData();
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(pageInfo) {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: pageInfo.navPage,
                    type: pageInfo.navType,
                    config: {
                        linkItem: pageInfo.linkItem
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" src="../css/promotions.module.scss" module></style>
