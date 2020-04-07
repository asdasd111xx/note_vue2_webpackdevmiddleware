<template>
    <div :class="$style['lang']">
        <!-- 語系 select -->
        <div :class="[$style['lang-select'], 'clearfix']" @click="langListOpen = !langListOpen">
            <div :class="$style['lang-select-icon']">
                <span :class="$i18n.locale" />
            </div>
            <div :class="$style['lang-select-text']">{{ langArr[this.$i18n.locale] }}</div>
        </div>
        <transition name="slide-down">
            <div v-if="langListOpen" :class="$style['lang-list-wrap']">
                <div
                    v-for="(item, index) in langArr"
                    :key="index"
                    :class="[$style['lang-list-item'], index === $i18n.locale ? $style['current'] : '', 'clearfix']"
                    @click="setLanguage(index)"
                >
                    <div :class="$style['lang-list-icon']">
                        <span :class="index" />
                    </div>
                    <div :class="$style['lang-list-text']">{{ item }}</div>
                </div>
            </div>
        </transition>
        <!-- eslint-disable vue/html-indent -->
        <v-style :module="true">
            .{{ $style['lang-select-icon'] }} span,
            .{{ $style['lang-list-icon'] }} span {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/zh-cn.png') }});
            }

            .{{ $style['lang-select-icon'] }} span.zh-tw,
            .{{ $style['lang-list-icon'] }} span.zh-tw {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/zh-tw.png') }});
            }

            .{{ $style['lang-select-icon'] }} span.en,
            .{{ $style['lang-list-icon'] }} span.en {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/en.png') }});
            }

            .{{ $style['lang-select-icon'] }} span.ja,
            .{{ $style['lang-list-icon'] }} span.ja {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/ja.png') }});
            }

            .{{ $style['lang-select-icon'] }} span.vi,
            .{{ $style['lang-list-icon'] }} span.vi {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/vi.png') }});
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            langListOpen: false
        };
    },
    computed: {
        ...mapGetters({
            langArr: 'getLang',
            lang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionSetLang'
        ]),
        setLanguage(value) {
            this.langListOpen = false;

            if (this.lang === value) {
                return;
            }
            this.actionSetLang(value);
        }
    }
};
</script>

<style lang="scss" src="./css/lang.module.scss" module></style>
