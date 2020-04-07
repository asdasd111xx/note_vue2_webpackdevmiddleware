<template>
    <div :style="style">
        <div :class="$style['top-promotion']" @click="active = !active">
            <img :class="$style.imgout" :src="getImage('normal', info)" />
            <img :class="$style.imgin" :src="getImage('hover', info)" />
        </div>
        <component
            :is="type"
            :slider="slider"
            :info="info"
            :text="text"
            :active="active"
            :get-image="getImage"
            :get-image-style="getImageStyle"
            @change="changePage"
            @close="active = false"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import isMobile from '@/lib/is_mobile';

/**
 * 營銷圖文板塊
 * @module element/articleImg/articleImg04/template/themeDefault
 */
export default {
    components: {
        popSlide: () => import(/* webpackChunkName: 'popSlide' */'./popSlide'),
        popUp: () => import(/* webpackChunkName: 'popUp' */'./popUp')
    },
    props: {
        theme: {
            type: String,
            required: true
        },
        info: {
            type: Object,
            required: true
        },
        content: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isMobile: isMobile(),
            active: false,
            promotion: ''
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        style() {
            return {
                'padding-top': `${this.info.top[this.curLang]}px`,
                'padding-bottom': `${this.info.bottom[this.curLang]}px`
            };
        },
        type() {
            // 輝煌手機版固定使用彈窗
            if (this.isMobile && ['177', '30', '32'].includes(this.webInfo.alias)) {
                return 'pop-up';
            }

            if (this.theme === 'A') {
                return 'pop-slide';
            }

            return 'pop-up';
        },
        slider() {
            return JSON.parse(this.info.slider[this.curLang]);
        },
        text() {
            if (this.isBackEnd) {
                return this.content[this.curLang];
            }

            return this.promotion;
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }

        const url = `/tpl/${this.memInfo.user.domain}${this.content[this.curLang]}`;
        axios.get(url).then(({ data }) => { this.promotion = data; });
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        /**
         * 取得圖片
         * @method getImage
         * @param {string} key - 圖片類型
         * @param {object} data - 圖片資料
         * @return {string} 圖片路徑
         */
        getImage(key, data) {
            const image = typeof data.image === 'object' ? data.image[this.curLang] : data.image;
            const imageHover = typeof data.imageHover === 'object' ? data.imageHover[this.curLang] : data.imageHover;

            if (key === 'hover') {
                return this.$getCdnPath(`${this.cdnDomain}${imageHover || image}`);
            }

            return this.$getCdnPath(`${this.cdnDomain}${image}`);
        },
        /**
         * 取得圖片樣式
         * @method getImageStyle
         * @param {object} data - 圖片資料
         * @return {object} css object
         */
        getImageStyle(data) {
            if (!this.isMobile) {
                return {};
            }

            // 防範機制，避免後端沒將以下key新增到資料庫造成程式錯誤
            // 待上線後確認無問題即可刪除
            if (!('imageInfo' in data)) {
                return {};
            }

            const deviceWidth = window.innerWidth;

            if (data.imageInfo[0] < deviceWidth) {
                return { width: '33.333%' };
            }

            return {};
        },
        /**
         * 切換頁面
         * @method changePage
         * @param {string} linkTo - 連結位置
         * @param {string} linkType - 連結類型
         * @param {string} linkItem - 連結子項目
         */
        changePage({ linkTo, linkType, linkItem }) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: linkTo,
                type: linkType,
                config: {
                    linkItem
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.top-promotion {
    cursor: pointer;

    &:hover {
        .imgout {
            display: none;
        }

        .imgin {
            display: block;
        }
    }

    > img {
        width: 100%;
        pointer-events: none;
    }

    .imgout {
        display: block;
    }

    .imgin {
        display: none;
    }
}
</style>
