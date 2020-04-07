<template>
    <div
        :class="['lang', { active: isActive }]"
        @click="isActive = !isActive"
        @mouseenter="isActive = true"
        @mouseleave="isActive = false"
    >
        <!-- 語系 select -->
        <div class="lang-select clearfix">
            <div class="lang-select-icon">
                <span :class="$i18n.locale" />
            </div>
            <div class="lang-select-text">{{ langArr[this.$i18n.locale] }}</div>
        </div>
        <transition name="slide-down">
            <div v-show="isActive" class="lang-list-wrap">
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
            isActive: false
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

<style lang="scss" src="../css/lang.scss" scoped />
