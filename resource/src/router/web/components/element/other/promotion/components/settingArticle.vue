<template>
    <div ref="component-modal" class="ui modal small">
        <div class="header">
            <i class="edit large icon" />
            <span>{{ $text('S_PROMOTION_TEMPLATE_SET') }}</span>
        </div>
        <div class="ui form content clearfix">
            <div :class="$style.wrap">
                <div :class="$style.title">
                    <span>{{ $text('S_ARTICLE_BACKGROUND') }}</span>
                    <span :class="$style['radio-text']">
                        <input
                            id="article-bg-default"
                            v-model="backgroundStyle"
                            :value="0"
                            name="article-bg"
                            type="radio"
                        />
                        <label for="article-bg-default">{{ $text('S_DEFAULT') }}</label>
                    </span>
                    <span :class="$style['radio-text']">
                        <input
                            id="article-bg-custom"
                            v-model="backgroundStyle"
                            :value="1"
                            name="article-bg"
                            type="radio"
                        />
                        <label for="article-bg-custom">{{ $text('S_CUSTOM') }}</label>
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
            <div :class="$style.wrap">
                <div :class="$style.title">
                    <span>{{ $text('S_CLOSE_BUTTON') }}({{ $text('S_LAYOUT') }}A)</span>
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
                <div :class="$style['color-wrap']">
                    <color-picker
                        :color-val="closeColor"
                        :disabled="!buttonStyle"
                        :on-change="(val) => { closeColor = val }"
                    />
                </div>
            </div>
        </div>
        <div :class="['ui', 'form', 'content', $style.line]">
            <div
                v-for="theme in [0, 1, 2]"
                :key="theme"
                :class="[$style['countdown-timer-wrap'], { [$style.active]: timerStyle === theme }]"
                @click="timerStyle = theme"
            >
                <countdown-timer :theme="theme" />
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
import countdownTimer from './countdownTimer';

export default {
    components: {
        colorPicker,
        countdownTimer
    },
    props: {
        element: {
            type: Object,
            default: null
        }
    },
    data() {
        const temp = JSON.parse(this.element.case.setting.article);
        const backgroundStyle = temp['background-style'];
        const buttonStyle = temp['button-style'];
        const bgColor = temp.color;
        const closeColor = temp.button.close.color;
        const timerStyle = +this.element.case.setting['timer-style'];

        return {
            backgroundStyle,
            buttonStyle,
            bgColor,
            closeColor,
            timerStyle,
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

            const article = {
                'background-style': this.backgroundStyle,
                'button-style': this.buttonStyle,
                color: this.bgColor,
                button: {
                    close: {
                        color: this.closeColor
                    }
                }

            };
            const setting = {
                ...this.element.case.setting,
                'timer-style': this.timerStyle,
                article: JSON.stringify(article)
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

    .custom-color {
        width: 199px !important;
    }
}

.wrap {
    float: left;
}

.line {
    border-top: 1px solid #E1E1E1;
}

.title {
    margin-left: 20px;

    span {
        margin-right: 15px;
    }
}

.radio-text {
    font-size: 14px;
}

.color-wrap {
    width: 226px;
    margin: 15px 0 0 20px;
    border: 1px solid #E1E1E1;

    > label {
        display: block;
        width: 194px;
        margin: 5px auto 0;
    }
}

.countdown-timer-wrap {
    width: 226px;
    border: 3px solid transparent;
    border-radius: 6px;

    &.active {
        border-color: #FC0;
    }
}
</style>
