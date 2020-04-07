<template>
    <div class="change-lang-wrap">
        <div
            v-for="(item, index) in resultLang"
            :key="index"
            class="lang-item"
            @click="setLanguage(item.type)"
        >
            <div :class="`lang-icon ${item.type}`" />
            <span class="lang-text">{{ item.name }}</span>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .change-lang-wrap .lang-item .lang-icon[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/flag_zh_cn.png') }});
            }

            .change-lang-wrap .lang-item .lang-icon.zh-tw[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/flag_zh_tw.png') }});
            }

            .change-lang-wrap .lang-item .lang-icon.en[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/flag_en.png') }});
            }

            .change-lang-wrap .lang-item .lang-icon.ja[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/flag_ja.png') }});
            }

            .change-lang-wrap .lang-item .lang-icon.vi[{{ this.$options._scopeId }}] {
                background-image: url({{ $getCdnPath('/static/image/mobile/footer/flag_vi.png') }});
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import exceptionList from '@/config/exceptionList';

export default {
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            langArr: 'getLang',
            lang: 'getCurLang',
            webInfo: 'getWebInfo'
        }),
        resultLang() {
            return this.isException
                .filter((langType) => this.langArr[langType])
                .map((langType) => ({ type: langType, name: this.langArr[langType] }));
        },
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            const langAry = Object.keys(this.langArr);

            if (wonderCasino.includes(this.webInfo.alias)) {
                const wonderAry = ['ja', 'en', 'zh-cn'];

                langAry.forEach((item) => {
                    if (item === 'vi' || item === 'zh-tw') {
                        wonderAry.push(item);
                    }
                });
                return wonderAry;
            }

            if (knightCasino.includes(this.webInfo.alias)) {
                langAry.splice(langAry.indexOf('zh-cn'), 1);
                return langAry;
            }

            return langAry;
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionSetLang'
        ]),
        setLanguage(value) {
            if (this.lang === value) {
                return;
            }
            this.actionSetLang(value);
        }
    }
};
</script>

<style src="../css/index.scss" lang="scss" scoped></style>
