<template>
    <component
        :is="`theme${theme}`"
        v-if="isShowLang"
        :class="commonClass"
        :lang-data="resultLang"
        :shape="shape"
        :mode="mode"
    />
</template>

<script>
import { mapGetters } from 'vuex';
import exceptionList from '@/config/exceptionList';

/**
 * 共用元件 - 語系選單
 * @param {String} [theme=1] - 樣式; 值：1,2
 * @param {String} [shape=cycle] - 國旗圖示形狀; 值：cycle,square
 * @param {String} [mode=a] - 國旗圖示樣式; 值：cycle(a,b,c,d),square(a,b,c,d)
 */
export default {
    components: {
        theme1: () => import(/* webpackChunkName: 'theme1' */'./template/theme1'),
        theme2: () => import(/* webpackChunkName: 'theme2' */'./template/theme2')
    },
    props: {
        theme: {
            type: String,
            default: '1'
        },
        shape: {
            type: String,
            default: 'cycle'
        },
        mode: {
            type: String,
            default: 'a'
        }
    },
    data() {
        return {
            commonClass: ['lang-wrap', 'clearfix']
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            webInfo: 'getWebInfo'
        }),
        resultLang() {
            return this.isException
                .filter((langType) => this.lang[langType])
                .map((langType) => ({ type: langType, name: this.lang[langType] }));
        },
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;

            if (wonderCasino.includes(this.webInfo.alias)) {
                return ['ja', 'en', 'zh-cn'];
            }

            if (knightCasino.includes(this.webInfo.alias)) {
                return ['ja', 'en'];
            }

            return ['zh-tw', 'zh-cn', 'en', 'ja', 'vi'];
        },
        isShowLang() {
            return Object.keys(this.lang).length > 1;
        }
    }
};
</script>

<style lang="scss" scoped>
.lang-wrap {
    position: relative;
}
</style>
