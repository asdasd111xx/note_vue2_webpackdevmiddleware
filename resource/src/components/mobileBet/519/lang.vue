<template>
    <div :class="$style['lang']">
        <!-- 語系 select -->
        <div :class="[$style['lang-select'], $style['lang-btn'], 'clearfix']" @click="langListOpen = !langListOpen">
            <div :class="[$style['lang-select-icon'], $i18n.locale]" />
            <div :class="['lang-select-text', $style['lang-text']]">{{ langArr[this.$i18n.locale] }}</div>
            <div :class="[$style['lang-arrow'], $style[langListOpen ? 'active' : '']]" />
        </div>
        <transition name="slide-down">
            <div v-if="langListOpen" :class="$style['lang-list-wrap']">
                <div
                    v-for="(item, index) in langArr"
                    :key="index"
                    :class="[$style['lang-list-item'], $style['lang-btn'], $style[index === $i18n.locale ? 'current' : ''], 'clearfix']"
                    @click="setLanguage(index)"
                >
                    <div :class="[$style['lang-select-icon'], index]" />
                    <div :class="['lang-list-text', $style['lang-text']]">{{ item }}</div>
                </div>
            </div>
        </transition>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .{{ $style['lang-btn'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/icon_select.png') }}) 0 0 /contain no-repeat;
            }

            .{{ $style['lang-btn'] }}.current,
            .{{ $style['lang-btn'] }}:hover {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/icon_select_hover.png') }}) 0 0 /contain no-repeat;
            }

            .{{ $style['lang-select-icon'] }}.zh-tw {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/zh-tw.png') }});
            }

            .{{ $style['lang-select-icon'] }}.zh-cn {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/zh-cn.png') }});
            }

            .{{ $style['lang-select-icon'] }}.en {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/en.png') }});
            }

            .{{ $style['lang-select-icon'] }}.ja {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/header/lang/2/ja.png') }});
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
