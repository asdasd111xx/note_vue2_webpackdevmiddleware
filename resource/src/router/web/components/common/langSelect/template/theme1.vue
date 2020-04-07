<template>
    <div>
        <div
            v-for="langInfo in langData"
            :key="langInfo.type"
            :title="langInfo.name"
            :class="mainClass(langInfo.type)"
            @click="setLanguage(langInfo.type)"
        />
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
            // eslint-disable-next-line
            styleData: getImageConfig(this.$options._scopeId)
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
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
        }
    }
};
</script>

<style lang="scss" src="../css/theme1.scss" scoped></style>
