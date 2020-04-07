<template>
    <div ref="component-modal" class="ui modal small">
        <div class="header">
            <i class="edit large icon" />{{ $text('S_CARD_SETTINGS') }}
        </div>
        <div class="ui form content">
            <div :class="$style.title">
                <span>{{ $text('S_CARD_BACKGROUND') }}</span>
                <span :class="$style['radio-text']">
                    <input
                        id="card-bg-default"
                        v-model="backgroundStyle"
                        :value="0"
                        name="card-bg"
                        type="radio"
                    />
                    <label for="card-bg-default">{{ $text('S_DEFAULT') }}</label>
                </span>
                <span :class="$style['radio-text']">
                    <input
                        id="card-bg-custom"
                        v-model="backgroundStyle"
                        :value="1"
                        name="card-bg"
                        type="radio"
                    />
                    <label for="card-bg-custom">{{ $text('S_CUSTOM') }}</label>
                </span>
            </div>
            <div :class="$style['color-wrap']">
                <color-picker
                    :color-val="bgColor"
                    :disabled="!backgroundStyle"
                    :on-change="(val) => { bgColor = val }"
                />
            </div>
        </div>
        <div :class="['ui', 'form', 'content', $style.line]">
            <div :class="$style.title">
                <span>{{ $text('S_CARD_BUTTON') }}</span>
                <span :class="$style['radio-text']">
                    <input
                        id="button-color-default"
                        v-model="buttonStyle"
                        :value="0"
                        name="button-color"
                        type="radio"
                    />
                    <label for="button-color-default">{{ $text('S_DEFAULT') }}</label>
                </span>
                <span :class="$style['radio-text']">
                    <input
                        id="button-color-custom"
                        v-model="buttonStyle"
                        :value="1"
                        name="button-color"
                        type="radio"
                    />
                    <label for="button-color-custom">{{ $text('S_CUSTOM') }}</label>
                </span>
            </div>
            <div
                v-for="(data, type, index) in cardColor"
                :key="type"
                class="clearfix"
            >
                <div
                    v-for="(info, name) in data"
                    :key="`${type}-${name}`"
                    :class="$style.type"
                >
                    <label v-if="!index">
                        <span>{{ $text(`S_PROMOTION_${name.toUpperCase()}_BUTTON`) }}</span>
                        <span v-if="name === 'more'" :class="$style.copy">
                            <input
                                id="copy"
                                v-model="isCopied"
                                :disabled="!buttonStyle"
                                name="copy"
                                type="checkbox"
                            />
                            <label for="copy">{{ $text('S_COPY_TO_JOIN_PROMOTION') }}</label>
                        </span>
                    </label>
                    <div
                        v-for="(value, key) in info"
                        :key="`${type}-${name}-${key}`"
                        :class="$style['color-wrap']"
                    >
                        <label>{{ $text(`S_${type.toUpperCase()}_${key.toUpperCase()}`) }}</label>
                        <color-picker
                            :color-val="value"
                            :disabled="!buttonStyle || (name === 'join' && isCopied)"
                            :on-change="(val) => { onChange(type, name, key, val) }"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div :class="['ui', 'button', 'primary', { disabled: isSubmitting }]" @click="onComfirm">{{ $text('S_CONFIRM', memInfo.config.lang) }}</div>
            <div class="ui small button" @click="onClose">{{ $text('S_CLOSE', memInfo.config.lang) }}</div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import colorPicker from '@/components/colorPicker';

export default {
    components: {
        colorPicker
    },
    props: {
        element: {
            type: Object,
            default: null
        }
    },
    data() {
        const temp = JSON.parse(this.element.case.setting.card);
        const backgroundStyle = temp['background-style'];
        const buttonStyle = temp['button-style'];
        const bgColor = temp.color;
        const cardColor = { button: temp.button, text: temp.text };

        return {
            backgroundStyle,
            buttonStyle,
            bgColor,
            cardColor,
            isCopied: false,
            isSubmitting: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    mounted() {
        // modal 初始設定
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onHidden: () => { this.$emit('close'); }
        });

        $(this.$refs['component-modal']).modal('show');
    },
    beforeDestroy() {
        $(this.$refs['component-modal']).modal('destroy');
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        onChange(type, name, key, value) {
            this.cardColor = {
                ...this.cardColor,
                [type]: {
                    ...this.cardColor[type],
                    [name]: {
                        ...this.cardColor[type][name],
                        [key]: value
                    }
                }
            };
        },
        /**
         * 關閉 semantic modal
         * @method onClose
         */
        onClose() {
            $(this.$refs['component-modal']).modal('hide');
        },
        /**
         * 送出表單
         * @method onComfirm
         */
        onComfirm() {
            if (this.isSubmitting) {
                return;
            }

            this.isSubmitting = true;

            const card = {
                'background-style': this.backgroundStyle,
                'button-style': this.buttonStyle,
                color: this.bgColor,
                button: {
                    more: this.cardColor.button.more,
                    join: this.isCopied ? this.cardColor.button.more : this.cardColor.button.join
                },
                text: {
                    more: this.cardColor.text.more,
                    join: this.isCopied ? this.cardColor.text.more : this.cardColor.text.join
                }

            };
            const setting = {
                ...this.element.case.setting,
                card: JSON.stringify(card)
            };

            this.actionCaseSave({
                case_id: this.element.i,
                content: this.element.case.content,
                field: this.element.case.data,
                setting
            }).then(({ status, message }) => {
                this.isSubmitting = false;

                if (status !== 'Y') {
                    this.$swal({
                        title: message || this.$text('S_CONTACT_SERVICE', this.memInfo.config.lang),
                        type: 'error'
                    });

                    return;
                }

                this.onClose();
            });
        }
    }
};
</script>

<style lang="scss" module>
:global {
    .style-bg-color-dropdown {
        border: none !important;
    }
}

.title {
    margin: 0 20px;

    span {
        margin-right: 15px;
    }
}

.radio-text {
    font-size: 14px;
}

.color-wrap {
    width: 226px;
    margin: 15px 20px 0;
    border: 1px solid #E1E1E1;

    > label {
        display: block;
        width: 194px;
        margin: 5px auto 0;
    }
}

.line {
    border-top: 1px solid #E1E1E1;
}

.type {
    float: left;

    > label {
        display: block;
        position: relative;
        margin: 20px 20px 0;
    }
}

.copy {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 12px;

    > input {
        margin: 2px 3px 0 0;
    }
}
</style>
