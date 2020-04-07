<template>
    <div :class="$style['edit-link']">
        <div :class="$style.tips">{{ $text('S_EXTERNAL_LINK_TIPS', '外部连结，此连结将取代下方内容编修。') }}</div>
        <div :class="$style.field">
            <input v-model="value.link[curLang]" type="text" />
            <div :class="$style.button" @click="onClick">{{ $text('S_FORM_CLEAR', '清除') }}</div>
        </div>
        <div v-if="isError" :class="$style.error">{{ $text('S_URL_ERROR', 'URL格式错误') }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import isURL from 'validator/lib/isURL';

export default {
    props: {
        value: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        isError() {
            if (this.value.link[this.curLang] === '') {
                return false;
            }

            return !isURL(this.value.link[this.curLang]);
        }
    },
    methods: {
        onClick() {
            this.$emit('input', {
                ...this.value,
                link: {
                    ...this.value.link,
                    [this.curLang]: ''
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.edit-link {
    margin: 10px;
}

.field {
    position: relative;

    input {
        width: 100%;
        padding: 3px 60px 3px 8px;
        outline: none;
    }
}

.button {
    position: absolute;
    top: 0;
    right: 0;
    width: 52px;
    padding: 3px 0;
    background-color: #F00;
    color: #FFF;
    text-align: center;
    cursor: pointer;
}

.error {
    color: #F00;
    font-size: 14px;
}
</style>
