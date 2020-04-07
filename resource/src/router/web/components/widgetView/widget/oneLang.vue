<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div
            v-for="langInfo in resultLang"
            :key="`lang-${langInfo.type}`"
            :class="mainClass(langInfo.type)"
            :title="langInfo.name"
            @click="setLanguage(langInfo.type)"
        >
            <img :src="$getCdnPath(`/static/image/lang/flag/${widgetsInfo[currentIndex].shape[curLang]}/${widgetsInfo[currentIndex].pattern[curLang]}/${langInfo.type.split('-')[1] || langInfo.type}.png`)" />
        </div>
    </widget-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import widgetContainer from './common/widgetContainer';

export default {
    components: {
        widgetContainer
    },
    props: {
        currentIndex: {
            type: Number,
            required: true
        },
        widgetsInfo: {
            type: Array,
            default: () => []
        },
        updateInfo: {
            type: Function,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            lang: 'getLang'
        }),
        resultLang() {
            const allLanguage = ['zh-tw', 'zh-cn', 'en', 'ja', 'vi'];
            return allLanguage
                .filter((langType) => this.lang[langType])
                .map((langType) => ({ type: langType, name: this.lang[langType] }));
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetLang'
        ]),
        setLanguage(targetLang) {
            if (this.isBackEnd || this.curLang === targetLang) {
                return;
            }
            this.actionSetLang(targetLang);
        },
        mainClass(lang) {
            return [
                this.$style['lang-icon'],
                this.$style[this.widgetsInfo[this.currentIndex].shape[this.curLang]],
                lang
            ];
        }
    }
};
</script>

<style lang="scss" module>
.lang-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: cover;

    img {
        display: block;
        width: inherit;
        height: inherit;
    }
}

.square {
    height: 14px;
}
</style>
