<template>
    <semantic-modal
        :has-close="true"
        :on-hidden="onEditCancel"
        :on-confirm="onEditSave"
        :size="'tiny'"
        :title="$text('S_EDIT', { text: '编辑', locale: memInfo.config.lang || 'zh-cn' })"
        icon-name="icon-set"
    >
        <div class="ui form content">
            <div
                v-for="(caseData, index) in elementData.case.data"
                :key="`case-${caseData.key[curLang]}-${index}`"
                class="element-item"
            >
                <div class="inline fields">
                    <div v-if="caseData.key[curLang] !== 'email' && caseData.key[curLang] !== 'content'" class="field labelWidth">
                        <div class="ui checkbox">
                            <input
                                v-if="caseData.key[curLang] !== 'email' && caseData.key[curLang] !== 'content'"
                                v-model="caseData.state[curLang]"
                                type="checkbox"
                                true-value="Y"
                                false-value="N"
                            />
                            <label>{{ $text(label[caseData.key[curLang]]) }}</label>
                        </div>
                    </div>
                    <div v-if="caseData.key[curLang] === 'email' || caseData.key[curLang] === 'content'" class="field labelWidth">
                        <label>{{ $text(label[caseData.key[curLang]]) }}</label>
                    </div>
                    <div class="field inputWidth">
                        <input
                            v-model="caseData.placeholder[curLang]"
                            :placeholder="caseData.placeholder[curLang]"
                            class="placeholderWidth"
                            type="text"
                        />
                    </div>
                </div>
            </div>
            <div class="input-border-radius">
                <label class="title">
                    {{ $text('S_INPUT_BORDER_SETTING', {
                        text: '输入框圓角设定',
                        locale: memInfo.config.lang || 'zh-cn'
                    }) }}
                </label>
                <div class="setting-box">
                    <label class="switch">
                        <input v-model="hasRadius" type="checkbox" />
                        <span :class="['slider', 'round', hasRadius ? 'checked' : '']" />
                    </label>
                </div>
            </div>
            <div
                v-for="(item ,index) in inputSetting"
                :key="`input-setting-${index}`"
                class="color-picker"
            >
                <p>{{ item.text }}</p>
                <color-picker :color-val="item.value" :on-change="item.onChange" />
            </div>
        </div>
    </semantic-modal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';
import semanticModal from '@/components/semanticModal';
import colorPicker from '@/components/colorPicker';

export default {
    components: {
        semanticModal,
        colorPicker
    },
    props: {
        element: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            elementData: {},
            label: {
                name: 'S_FORM_NAME',
                username: 'S_FORM_ACCOUNT',
                phone: 'S_FORM_PHONE',
                qq_num: 'S_FORM_QQ',
                weixin: 'S_FORM_WECHAT',
                email: 'S_FORM_MAIL',
                content: 'S_FORM_CONTACT'
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        inputSetting() {
            return [
                {
                    text: this.$text('S_INPUT_COLOR', {
                        text: '输入框文字颜色',
                        locale: this.memInfo.config.lang || 'zh-cn'
                    }),
                    value: this.elementData.case.setting.inputColor,
                    onChange: (val) => {
                        this.onChange(val, 'inputColor');
                    }
                },
                {
                    text: this.$text('S_INPUT_PLACEHOLDER_COLOR', {
                        text: '输入框提示文字颜色',
                        locale: this.memInfo.config.lang || 'zh-cn'
                    }),
                    value: this.elementData.case.setting.inputPlaceholderColor,
                    onChange: (val) => {
                        this.onChange(val, 'inputPlaceholderColor');
                    }
                },
                {
                    text: this.$text('S_INPUT_BG_COLOR', {
                        text: '输入框背景颜色',
                        locale: this.memInfo.config.lang || 'zh-cn'
                    }),
                    value: this.elementData.case.setting.inputBgColor,
                    onChange: (val) => {
                        this.onChange(val, 'inputBgColor');
                    }
                },
                {
                    text: this.$text('S_INPUT_BG_FOCUS_COLOR', {
                        text: '输入框背景聚焦颜色',
                        locale: this.memInfo.config.lang || 'zh-cn'
                    }),
                    value: this.elementData.case.setting.inputBgFocusColor,
                    onChange: (val) => {
                        this.onChange(val, 'inputBgFocusColor');
                    }
                },
                {
                    text: this.$text('S_INPUT_BORDER_COLOR', {
                        text: '输入框边框颜色',
                        locale: this.memInfo.config.lang || 'zh-cn'
                    }),
                    value: this.elementData.case.setting.borderColor,
                    onChange: (val) => {
                        this.onChange(val, 'borderColor');
                    }
                },
                {
                    text: this.$text('S_INPUT_BORDER_FOCUS_COLOR', {
                        text: '输入框边框聚焦颜色',
                        locale: this.memInfo.config.lang || 'zh-cn'
                    }),
                    value: this.elementData.case.setting.borderFocusColor,
                    onChange: (val) => {
                        this.onChange(val, 'borderFocusColor');
                    }
                }
            ];
        },
        hasRadius: {
            get() {
                return this.elementData.case.setting.hasRadius === 'Y';
            },
            set(val) {
                this.elementData.case.setting.hasRadius = val ? 'Y' : 'N';
            }
        }
    },
    created() {
        this.elementData = cloneDeep(this.element);
    },
    methods: {
        onEditSave() {
            this.$emit('update', this.elementData);
            this.$emit('close');
        },
        onEditCancel() {
            this.$emit('close');
        },
        onChange(color, type) {
            this.elementData.case.setting[type] = color;
        }
    }
};
</script>

<style lang="scss" scoped>
.ui {
    &.form {
        .element-item{
            padding-bottom: 10px;

            .labelWidth{
                width: 25%;
            }
            .inputWidth{
                width: 75%;
            }
        }

        .inline {
            &.fields {
                .field {
                    .placeholderWidth{
                        width: 100%;
                    }
                }
            }
        }
    }
}

.content {
    .color-picker {
        display: inline-block;
        margin-bottom: 5px;

        p {
            text-align: center;
        }
    }

    .input-border-radius {
        margin-bottom: 10px;
        height: 34px;

        .title {
            width: 33%;
            font-weight: bold;
            color: #000;
            display: inline-block;
            vertical-align: middle;
        }

        .setting-box {
            width: 65%;
            text-align: center;
            display: inline-block;
            vertical-align: middle;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;

            input {
                display: none;
            }
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #CCC;
            -webkit-transition: .4s;
            transition: .4s;

            &:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: #FFF;
                -webkit-transition: .4s;
                transition: .4s;
            }

            &.checked {
                background-color: #2196F3;

                &:before {
                    transform: translateX(26px);
                }
            }

            &.round {
                border-radius: 34px;

                &:before {
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>
