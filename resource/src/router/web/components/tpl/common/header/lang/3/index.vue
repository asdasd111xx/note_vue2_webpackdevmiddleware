<template>
    <div class="lang">
        <!-- 語系 select -->
        <div class="lang-select clearfix" @click="langListOpen = !langListOpen">
            <div class="lang-select-icon">
                <span :class="$i18n.locale" />
            </div>
            <div class="lang-select-text">{{ langArr[this.$i18n.locale] }}</div>
        </div>
        <transition name="slide-down">
            <div v-if="langListOpen" class="lang-list-wrap">
                <div
                    v-for="(item, index) in langArr"
                    :key="index"
                    :class="['lang-list-item', index === $i18n.locale ? 'current' : '', 'clearfix']"
                    @click="setLanguage(index)"
                >
                    <div class="lang-list-icon">
                        <span :class="index" />
                    </div>
                    <div class="lang-list-text">{{ item }}</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            langListOpen: false,
            currentLangText: ''
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
            if (value === this.lang) return;
            this.actionSetLang(value);
        }
    }
};
</script>
