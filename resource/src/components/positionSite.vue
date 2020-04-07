<template>
    <div ref="style-bg-align-dropdown" :class="dropdownClass">
        <div class="text">{{ dropdownTitle(alignVal) }}</div>
        <i class="dropdown icon" />
        <div class="menu">
            <div
                :class="{
                    item: true,
                    selected: (alignVal === 'lt' || alignVal === '')
                }"
                :data-text="`${dropdownTitle('lt')}`"
                data-value="lt"
            >
                <span class="lt-img" />
            </div>
            <div
                :class="{
                    item: true,
                    center: true,
                    selected: (alignVal === 'ct')
                }"
                :data-text="`${dropdownTitle('ct')}`"
                data-value="ct"
            >
                <span class="ct-img" />
            </div>
            <div
                :class="{
                    item: true,
                    selected: (alignVal === 'rt')
                }"
                :data-text="`${dropdownTitle('rt')}`"
                data-value="rt"
            >
                <span class="rt-img" />
            </div>
            <div
                :class="{
                    item: true,
                    'bottom-item': true,
                    left: true,
                    selected: (alignVal === 'lb')
                }"
                :data-text="`${dropdownTitle('lb')}`"
                data-value="lb"
            >
                <span class="lb-img" />
            </div>
            <div
                :class="{
                    item: true,
                    'bottom-item': true,
                    center: true,
                    selected: (alignVal === 'cb')
                }"
                :data-text="`${dropdownTitle('cb')}`"
                data-value="cb"
            >
                <span class="cb-img" />
            </div>
            <div
                :class="{
                    item: true,
                    'bottom-item': true,
                    selected: (alignVal === 'rb')
                }"
                :data-text="`${dropdownTitle('rb')}`"
                data-value="rb"
            >
                <span class="rb-img" />
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 共用元件 - 圖片對齊下拉選單
 * @param {String} [alignVal=ct] - 當前的值為何; <is requires> 值：lt,ct,rt,lb,cb,rb
 * @param {Function} [onChange=() => {}] - change 事件
 */

/* global $ */
import { mapGetters } from 'vuex';

export default {
    props: {
        alignVal: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        onChange: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        dropdownClass() {
            return [
                'ui',
                'selection',
                'dropdown',
                {
                    disabled: this.disabled
                }
            ];
        }
    },
    mounted() {
        // 背景對齊下拉選單設定
        $(this.$refs['style-bg-align-dropdown']).dropdown({
            onChange: this.onChange
        });
    },
    beforeDestroy() {
        // 卸載背景對齊下拉選單
        $(this.$refs['style-bg-align-dropdown']).dropdown('destroy');
    },
    methods: {
        /**
         * 圖片對齊標題
         * @param {String} [key=ct] - 當前的值為何; <is requires> 值：lt,ct,rt,lb,cb,rb
         * @returns {String} 當前圖片對齊的標題
         */
        dropdownTitle(key) {
            switch (key) {
                case 'lt':
                    return `${this.$t('S_IMG_ALIGN', this.memInfo.config.lang || 'zh-cn')}：${this.$t('S_TOP_LEFT', this.memInfo.config.lang || 'zh-cn')}`;
                case 'rt':
                    return `${this.$t('S_IMG_ALIGN', this.memInfo.config.lang || 'zh-cn')}：${this.$t('S_TOP_RIGHT', this.memInfo.config.lang || 'zh-cn')}`;
                case 'lb':
                    return `${this.$t('S_IMG_ALIGN', this.memInfo.config.lang || 'zh-cn')}：${this.$t('S_LOWER_LEFT', this.memInfo.config.lang || 'zh-cn')}`;
                case 'cb':
                    return `${this.$t('S_IMG_ALIGN', this.memInfo.config.lang || 'zh-cn')}：${this.$t('S_LOWER_MIDDLE', this.memInfo.config.lang || 'zh-cn')}`;
                case 'rb':
                    return `${this.$t('S_IMG_ALIGN', this.memInfo.config.lang || 'zh-cn')}：${this.$t('S_LOWER_RIGHT', this.memInfo.config.lang || 'zh-cn')}`;
                case 'ct':
                default:
                    return `${this.$t('S_IMG_ALIGN', this.memInfo.config.lang || 'zh-cn')}：${this.$t('S_TOP_MIDDLE', this.memInfo.config.lang || 'zh-cn')}`;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.ui {
    &.selection {
        &.dropdown {
            &.selected {
                background-color: transparent;
            }

            .menu {
                padding: 14px 22px;

                & > .item {
                    float: left;
                    padding: 0 !important;

                    &.selected {
                        background-color: transparent;

                        span {
                            &.lt-img,
                            &.ct-img,
                            &.rt-img,
                            &.lb-img,
                            &.cb-img,
                            &.rb-img {
                                background-position: left bottom;
                            }
                        }
                    }
                    &:hover {
                        background-color: transparent;
                    }
                    &.center {
                        margin: 0 15px;
                    }
                    &.bottom-item {
                        margin-top: 14px;
                        &.left {
                            clear: left;
                        }
                    }
                    span {
                        display: block;
                        width: 48px;
                        height: 48px;

                        &.lt-img {
                            background: url('/static/image/common/btn_top_L.png') 0 0 no-repeat;
                        }
                        &.ct-img {
                            background: url('/static/image/common/btn_top_M.png') 0 0 no-repeat;
                        }
                        &.rt-img {
                            background: url('/static/image/common/btn_top_R.png') 0 0 no-repeat;
                        }
                        &.lb-img {
                            background: url('/static/image/common/btn_bottom_L.png') 0 0 no-repeat;
                        }
                        &.cb-img {
                            background: url('/static/image/common/btn_bottom_M.png') 0 0 no-repeat;
                        }
                        &.rb-img {
                            background: url('/static/image/common/btn_bottom_R.png') 0 0 no-repeat;
                        }

                        &:hover {
                            background-position: left bottom;
                        }
                    }
                }
            }
        }
    }
}
</style>
