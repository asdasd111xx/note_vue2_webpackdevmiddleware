<template>
    <div @mouseover="timeClose" @mouseleave="autoClose">
        <div :class="['lang-current', 'clearfix', { 'is-show': isShow }]" @click="isShow = !isShow">
            <div :class="mainClass(curLang)" />
            <div class="lang-title">{{ lang[curLang] }}</div>
        </div>
        <div :class="['lang-select', { 'is-show': isShow }]">
            <template v-for="langInfo in langData">
                <div
                    :key="langInfo.type"
                    class="lang-box clearfix"
                    @click="setLanguage(langInfo.type)"
                >
                    <div :class="mainClass(langInfo.type)" />
                    <div class="lang-title">{{ langInfo.name }}</div>
                </div>
            </template>
        </div>
        <v-style :style-data="styleData" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getImageConfig } from '../config/imageConfig';

export default {
    props: {
        langData: {
            type: Array,
            required: true
        },
        shape: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            default: 'a'
        }
    },
    data() {
        return {
            isShow: false,
            // eslint-disable-next-line
            styleData: getImageConfig(this.$options._scopeId),
            closeCount: 0
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            lang: 'getLang',
            curLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionSetLang'
        ]),
        setLanguage(targetLang) {
            if (this.isBackEnd || this.curLang === targetLang) {
                return;
            }
            this.actionSetLang(targetLang);
        },
        mainClass(nowLang) {
            return [
                'lang-item',
                `style-${this.mode}`,
                `${nowLang}`,
                `${this.shape}`,
                {
                    current: nowLang === this.$i18n.locale
                }
            ];
        },
        autoClose() {
            this.closeCount = setTimeout(() => {
                this.isShow = false;
            }, 1000);
        },
        timeClose() {
            clearTimeout(this.closeCount);
        }
    }
};
</script>

<style lang="scss" src="../css/theme2.scss" scoped></style>
