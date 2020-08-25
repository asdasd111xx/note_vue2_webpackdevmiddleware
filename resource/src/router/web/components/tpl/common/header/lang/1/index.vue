<template>
    <div class="lang-wrap">
        <div
            v-for="(item, index) in langArr"
            :key="index"
            :class="`lang-item ${index} ${index === $i18n.locale ? 'current' : ''}`"
            :title="item"
            @click="$emit('setLanguage', index)"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            langArr: 'getLang',
            lang: 'getCurLang'
        })
    },
    mounted() {
        // 前台才動作
        if (!this.isBackEnd) {
            this.$on('setLanguage', this.setLanguage);
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionSetLang'
        ]),
        setLanguage(value) {
            if (value === this.lang) return;
            this.actionSetLang(value);
        }
    }
};
</script>
