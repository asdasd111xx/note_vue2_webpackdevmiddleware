<template>
    <div :class="$style['color-picker-wrap']">
        <div v-if="title" :class="$style.title">{{ title }}</div>
        <div
            :class="$style['color-brick']"
            :style="{ 'background-color': getColorFormat(valueColor) }"
            @click="displayPicker = !displayPicker"
        />
        <template v-if="displayPicker">
            <chrome-picker
                :value="valueColor"
                @input="updateColor"
            />
            <div :class="$style['btn-close']" @click="displayPicker = false">
                <icon
                    name="times-circle"
                    width="22px"
                    height="22px"
                />
            </div>
        </template>
    </div>
</template>

<script>
/**
 * 共用元件 - 顏色選單
 * @param {Object} valueColor - 顏色; 例：{ "r":0, "g":0, "b":0, "a":1 }
 * @param {String} title - 標題
 */

import { Chrome } from 'vue-color';

export default {
    components: {
        'chrome-picker': Chrome
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        valueColor: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            displayPicker: false
        };
    },
    methods: {
        updateColor(color) {
            this.$emit('update:valueColor', color.rgba);
        },
        getColorFormat(color) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        }
    }
};
</script>

<style lang="scss" module>
.color-picker-wrap {
    position: relative;

    .title {
        line-height: normal;
        font-size: 13px;
    }

    :global(.vc-chrome) {
        position: absolute;
        top: 36px;
        left: 0;
        z-index: 10;
    }
}

.color-brick {
    margin-right: 18px;
    width: 66px;
    height: 29px;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.btn-close {
    position: absolute;
    left: 204px;
    top: 6px;
    z-index: 1;
    cursor: pointer;
}
</style>
