<template>
    <div v-show="isFloatingShow" :class="{ 'mobile-show': mobileShow }">
        <float-side
            v-if="leftArr.length"
            :key="updateFlag"
            :float-items="leftArr"
            side="left"
        />
        <float-side
            v-if="rightArr.length"
            :key="updateFlag"
            :float-items="rightArr"
            side="right"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import floatSide from './floatingSide';

export default {
    components: {
        floatSide
    },
    props: {
        mobileShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            leftArr: [], // 左側陣列資料
            rightArr: [], // 右側陣列資料
            lang: this.$i18n.locale, // 當前語系
            updateFlag: 0 // 後台資料刷新重新掛載
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            floatPic: 'getFloatPic',
            floatEditStyleState: 'getFloatEditStyleState',
            langArr: 'getLang'
        }),
        isFloatingShow() {
            return this.isBackEnd ? this.floatEditStyleState : true;
        }
    },
    watch: {
        floatPic() {
            this.init();
        },
        leftArr() {
            this.updateFlag += 1;
        },
        rightArr() {
            this.updateFlag += 1;
        }
    },
    created() {
        this.init();
    },
    beforeUpdate() {
        /* 語系切換時重取資料 */
        if (this.lang !== this.$i18n.locale) {
            this.lang = this.$i18n.locale;
            this.init();
        }
    },
    methods: {
        init() {
            this.leftArr = [];
            this.rightArr = [];

            if (!this.floatPic.field) {
                return;
            }

            const lang = Object.keys(this.langArr).includes(this.lang) ? this.lang : 'zh-cn';

            this.floatPic.field.forEach((item) => {
                // 若為維護頁，但維護頁沒開浮動圖
                if (this.$route.name === 'upup' && item.upup && item.upup[lang] === 'N') {
                    return;
                }
                // 若為一般頁，但一般頁沒開浮動圖
                if (this.$route.name !== 'upup' && item.custom && item.custom[lang] === 'N') {
                    return;
                }
                const data = {
                    floatPic: item.floatPic[lang],
                    theme: item.theme ? item.theme[lang] : '3',
                    themeImg: item.themeImg ? item.themeImg[lang] : '',
                    themeImg_hover: item.themeImg_hover ? item.themeImg_hover[lang] : ''
                };

                // 若img_hover沒資料時 將img塞入img_hover
                data.floatPic = data.floatPic.map((info) => ({
                    ...info,
                    img_hover: info.img_hover || info.img
                }));

                if (item.floatSide[lang] === 'left') {
                    this.leftArr.push(data);
                }
                if (item.floatSide[lang] === 'right') {
                    this.rightArr.push(data);
                }
            });
        }
    }
};
</script>
