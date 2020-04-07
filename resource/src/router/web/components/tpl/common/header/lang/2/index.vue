<template>
    <div :class="[{ selected: langEdit }, 'lang']">
        <div
            :class="`lang-select ${$i18n.locale}`"
            :title="langArr[$i18n.locale]"
            @click="langEdit = !langEdit"
        />
        <transition name="fade">
            <div v-if="langEdit" class="lang-list-wrap">
                <div class="btn-close" @click="langEdit = false">×</div>
                <div class="lang-list-inner">
                    <img
                        :src="$getCdnPath(`/static/image/lang/title/${$i18n.locale}/lang_title.png`)"
                        class="lang-img-select"
                    />
                    <p class="lang-current-text">
                        {{ currentLangText }}
                    </p>
                    <div
                        v-for="(item, index) in langArr"
                        :key="index"
                        :class="['lang-item', index === $i18n.locale ? 'current' : '']"
                        @click="setLanguage(index)"
                        @mouseover="currentLangText = item"
                        @mouseleave="currentLangText = langArr[$i18n.locale]"
                    >
                        <div :class="`lang-icon ${index}`" :title="`${item}`" />
                    </div>
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
            currentLangText: '',
            langEdit: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            langArr: 'getLang',
            lang: 'getCurLang'
        })
    },
    created() {
        this.currentLangText = this.langArr[this.$i18n.locale];
    },
    methods: {
        ...mapActions([
            'actionSetLang'
        ]),
        setLanguage(value) {
            this.langEdit = false;
            if (value === this.lang) {
                return;
            }

            this.actionSetLang(value);
        }
    }
};
</script>
