<template>
    <div class="ui form content clearfix">
        <!-- 模塊與模塊的距離設定 -->
        <div class="field bg-color">
            <label>{{ $t('S_OUTER_SPACE', memInfo.config.lang || 'zh-cn') }}</label>
            <div class="equal width fields">
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_TOP_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value['margin-top']"
                        type="text"
                        maxlength="3"
                        @input="onVerification(value['margin-top'], 'margin-top')"
                    />
                    <div class="ui label label">px</div>
                </div>
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_BOTTOM_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value['margin-bottom']"
                        type="text"
                        maxlength="3"
                        @input="onVerification(value['margin-bottom'], 'margin-bottom')"
                    />
                    <div class="ui label label">px</div>
                </div>
            </div>
        </div>
        <!-- 模塊與模塊的距離設定 -->
        <div class="field bg-color">
            <label>{{ $t('S_INSIDE_SPACE', memInfo.config.lang || 'zh-cn') }}</label>
            <div class="equal width fields">
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_TOP_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value['padding-top']"
                        type="text"
                        maxlength="3"
                        @input="onVerification(value['padding-top'], 'padding-top')"
                    />
                    <div class="ui label label">px</div>
                </div>
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_BOTTOM_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value['padding-bottom']"
                        type="text"
                        maxlength="3"
                        @input="onVerification(value['padding-bottom'], 'padding-bottom')"
                    />
                    <div class="ui label label">px</div>
                </div>
            </div>
            <div class="equal width fields">
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_LEFT_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value['padding-left']"
                        type="text"
                        maxlength="3"
                        @input="onVerification(value['padding-left'], 'padding-left')"
                    />
                    <div class="ui label label">px</div>
                </div>
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_RIGHT_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value['padding-right']"
                        type="text"
                        maxlength="3"
                        @input="onVerification(value['padding-right'], 'padding-right')"
                    />
                    <div class="ui label label">px</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 模塊間距輸入表
 * @module element/field/moudleSpace
 * @param {object} element - 模塊資料
 * @param {object} value - 表單的值，雙向綁定
 */
import { mapGetters } from 'vuex';

export default {
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        /**
         * 驗證有效值
         * @method onVerification
         * @param {string} num - 當前值
         * @param {string} num - 當前key
         * @returns {string} 回傳驗證後的值
         */
        onVerification(num, key) {
            let newValue = +num.replace(/\D/g, '');

            if (newValue > 999) {
                newValue = 999;
            }

            this.$emit('input', {
                ...this.value,
                [key]: newValue.toString()
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.equal.width.fields {
    width: 90%;
    margin: 5px 0;

    .field.input {
        margin-right: 2px;
        padding-left: 0;

        input {
            text-align: right;
        }
    }
}
</style>
