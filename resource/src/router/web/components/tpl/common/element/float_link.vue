<template>
    <div :class="`mobile-hidden-${mobileHidden}`">
        <div
            v-if="leftShow"
            ref="leftWrap"
            :style="{overflow:'hidden'}"
            class="float-link-wrap float-left-wrap"
        >
            <div
                v-for="(item, index) in leftArr"
                :key="index"
                class="clearfix"
            >
                <float1
                    v-if="item.theme === '1'"
                    :edit-data="item"
                    :float-style="'left'"
                    @openSet="clickEvent"
                />
                <float2
                    v-if="item.theme === '2'"
                    :edit-data="item"
                    :float-style="'left'"
                    @openSet="clickEvent"
                />
                <float3
                    v-if="item.theme === '3'"
                    :edit-data="item"
                    :float-style="'left'"
                    @openSet="clickEvent"
                />
            </div>
        </div>
        <div
            v-if="rightShow"
            ref="rightWrap"
            :style="{overflow:'hidden'}"
            class="float-link-wrap float-right-wrap"
        >
            <div
                v-for="(item, index) in rightArr"
                :key="index"
                class="clearfix"
            >
                <float1
                    v-if="item.theme === '1'"
                    :edit-data="item"
                    :float-style="'right'"
                    @openSet="clickEvent"
                />
                <float2
                    v-if="item.theme === '2'"
                    :edit-data="item"
                    :float-style="'right'"
                    @openSet="clickEvent"
                />
                <float3
                    v-if="item.theme === '3'"
                    :edit-data="item"
                    :float-style="'right'"
                    @openSet="clickEvent"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { API_CDN } from '@/config/api';

export default {
    components: {
        float1: () => import(/* webpackChunkName: 'float1' */'./float/float1'),
        float2: () => import(/* webpackChunkName: 'float2' */'./float/float2'),
        float3: () => import(/* webpackChunkName: 'float3' */'./float/float3')
    },
    props: {
        mobileHidden: {
            type: String,
            default: 'Y'
        }
    },
    data() {
        return {
            API_CDN,
            floatTop: 150, // 浮動高度
            leftArr: [], // 左側陣列資料
            rightArr: [], // 右側陣列資料
            leftShow: true, // 左側是否顯示
            rightShow: true, // 右側是否顯示
            leftHover: 'nohover', // 左側目前hover對象
            rightHover: 'nohover', // 右側目前hover對象
            lang: this.$i18n.locale // 當前語系
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData',
            floatPic: 'getFloatPic'
        })
    },
    watch: {
        floatPic() {
            this.init();
        }
    },
    created() {
        window.addEventListener('scroll', this.TopSetting);
        this.init();
    },
    mounted() {
        this.TopSetting(this.floatTop);
    },
    beforeUpdate() {
        /* 語系切換時重取資料 */
        if (this.lang !== this.$i18n.locale) {
            this.lang = this.$i18n.locale;
            this.init();
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.TopSetting);
    },
    methods: {
        init() {
            this.leftArr = [];
            this.rightArr = [];
            /* 將資料塞到左右陣列 */
            if (!this.floatPic.field) {
                return;
            }
            this.floatPic.field.forEach((item) => {
                const data = {
                    floatPic: item.floatPic[this.lang],
                    theme: item.theme ? item.theme[this.lang] : '3',
                    themeImg: item.themeImg ? item.themeImg[this.lang] : '',
                    themeImg_hover: item.themeImg_hover ? item.themeImg_hover[this.lang] : ''
                };
                if (this.$route.name === 'upup' && item.upup && item.upup[this.lang] === 'N') {
                    return;
                }
                if (this.$route.name !== 'upup' && item.custom && item.custom[this.lang] === 'N') {
                    return;
                }

                if (item.floatSide[this.lang] === 'left') {
                    this.leftArr.push(data);
                }
                if (item.floatSide[this.lang] === 'right') {
                    this.rightArr.push(data);
                }
            });

            /* 若img_hover沒資料時 將img塞入img_hover */
            Object.keys(this.leftArr).forEach((index) => {
                const data = this.leftArr[index];
                data.img_hover = data.img_hover ? data.img_hover : data.img;
            });
            Object.keys(this.rightArr).forEach((index) => {
                const data = this.rightArr[index];
                data.img_hover = data.img_hover ? data.img_hover : data.img;
            });
        },
        TopSetting() {
            const doc = document.documentElement;
            const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            this.$refs.leftWrap.style.top = `${this.floatTop + top}px`;
            this.$refs.rightWrap.style.top = `${this.floatTop + top}px`;
        },
        clickEvent(item) {
            if (item.linkType !== 'close') {
                this.actionChangePage({
                    page: item.linkTo,
                    type: item.linkType,
                    config: {
                        width: item.openSetWitdth,
                        hight: item.openSetHeight,
                        linkItem: item.linkItem
                    }
                });
            }
        },
        ...mapActions([
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" src="@/css/tpl/common/element/float_link.scss">
</style>
