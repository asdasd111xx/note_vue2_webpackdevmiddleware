<template>
    <div class="style-bg-color-dropdown">
        <div :class="{'disabled-mask': true, 'is-show': !disabled}" />
        <div class="menu">
            <div class="default-color" @click="handleChangeBgColorClick('')">{{ $t('S_USE_DEFAULT_COLOR', memInfo.config.lang || 'zh-cn') }}</div>
            <div class="palette clearfix">
                <span
                    v-for="code in colorList"
                    :key="`palette-${code}`"
                    :style="{ backgroundColor: code }"
                    :class="{
                        'is-active': customColorCode === code.toUpperCase()
                    }"
                    @click="handleChangeBgColorClick(code)"
                >
                    <i class="check icon" />
                </span>
            </div>
            <div class="custom-color">
                <div :style="{ backgroundColor: customColorCode }" class="color-block" />
                <div class="field-wrap">
                    <input
                        v-model="customColorCode"
                        type="text"
                        maxlength="7"
                    />
                    <div v-show="customErrorTxt !== ''" class="ui pointing red basic label">{{ customErrorTxt }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 共用元件 - 背景顏色選單
 * @param {String} colorVal - 當前的值為何
 * @param {Function} [onChange=() => {}] - change 事件
 */

import { mapGetters } from 'vuex';

export default {
    props: {
        colorVal: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        onChange: {
            type: Function,
            default: () => ({})
        }
    },
    data() {
        return {
            colorList: ['#A7BAC1', '#78797B', '#FA8C97', '#F3D479', '#82D496', '#566996'],
            customColorCode: this.colorVal,
            customErrorTxt: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    watch: {
        /**
         * 當 customColorCode 值改變時，驗證色碼是否正確
         * @param {String} newCode - 新色碼
         */
        customColorCode(newCode) {
            // 空為預設顏色、色碼驗證：#開頭，且 a-f 及 0-9 的文字組成3或6碼
            if (newCode === '' || /^#[a-fA-F\d]{3}([a-fA-F\d]{3})?$/g.test(newCode)) {
                this.customErrorTxt = '';
                this.onChange(newCode);
                return;
            }

            // 驗證錯誤處理
            this.customErrorTxt = this.$t('S_INCORRECT_COLOR_CODE_FORMAT', this.memInfo.config.lang || 'zh-cn');
        }
    },
    methods: {
        /**
         * 當點選"使用預設顏色"或"色碼盤"時，更改色碼
         * @param {String} code - 新色碼
         */
        handleChangeBgColorClick(code) {
            this.customColorCode = code;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-bg-color-dropdown {
    position: relative;
    width: 224px;
    height: 146px;
    background-color: #FFF;
    border: 1px solid rgba(34, 36, 38, 0.35);

    .disabled-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(251, 251, 251, 0.6);

        &.is-show {
            display: none;
        }
    }

    .menu {
        .default-color {
            margin: 12px auto;
            width: 194px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 5px;
            border: 1px solid #E1E1E1;
            cursor: pointer;
        }

        .palette {
            margin: 0 auto;
            width: 194px;
            text-align: center;

            span {
                display: inline-block;
                margin: 0 3px;
                width: 26px;
                height: 26px;
                border-radius: 26px;
                vertical-align: top;
                cursor: pointer;

                i {
                    display: none;
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    color: #FFF;
                    font-family: 'Icons';
                    font-weight: normal;
                }

                &.is-active i,
                &:hover i {
                    display: block;
                }
            }
        }

        .custom-color {
            margin: 12px auto;
            width: 194px;

            .color-block {
                display: inline-block;
                margin-right: 6px;
                width: 66px;
                height: 30px;
                border-radius: 5px;
                vertical-align: top;
            }

            .field-wrap {
                display: inline-block;
                vertical-align: top;

                input {
                    display: block;
                    width: 118px;
                    height: 30px;
                    text-align: center;
                    border-radius: 5px;
                    border: 1px solid #E1E1E1;
                }
                .ui.basic.red.label {
                    padding: 7px;
                }
            }
        }
    }
}
</style>
