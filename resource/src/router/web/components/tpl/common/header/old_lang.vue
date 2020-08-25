<template>
    <div :class="[{ selected: langEdit }, 'lang']">
        <div :class="`lang-select ${$i18n.locale}`" @click="langEdit = !langEdit" />
        <transition name="fade">
            <div v-if="langEdit" class="lang-list">
                <div
                    v-for="(item, index) in LangArr"
                    :key="index"
                    class="lang-item"
                    @click="setLanguage(index)"
                >
                    <div :class="`lang-icon ${index}`" />
                    <span class="lang-text">{{ item }}</span>
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
            langEdit: false
        };
    },
    computed: {
        ...mapGetters({
            LangArr: 'getLang'
        })
    },
    methods: {
        setLanguage(value) {
            this.langEdit = false;
            if (value === this.$i18n.locale) {
                return;
            }

            this.actionSetLang(value);
        },
        ...mapActions([
            'actionSetLang'
        ])
    }
};
</script>
