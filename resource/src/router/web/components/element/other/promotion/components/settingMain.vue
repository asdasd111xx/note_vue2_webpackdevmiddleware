<template>
    <div ref="component-modal" class="ui modal small">
        <div class="header">
            <i class="edit large icon" />{{ $text('S_PROMOTION_TEMPLATE_SET') }}
        </div>
        <div :class="$style['main-title']">{{ $text('S_PROMOTION_BACKGROUND_SET') }}</div>
        <div class="ui form content">
            <!-- 背景圖設定 -->
            <div :class="['content', $style.image]">
                <div class="field">
                    <label>{{ $text('S_BACKGROUND_UPLOAD', memInfo.config.lang) }}</label>
                    <dropzone
                        :styles="dropStyle"
                        :types="['jpg', 'jpeg', 'gif', 'png']"
                        :cur-image="background['background-image']"
                        :on-complete="onUpload"
                        :on-remove="onRemove"
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-straight.png')" />
                        <p :class="$style['type-list']">JPG JPEG GIF PNG</p>
                        <p :class="$style.reminder">
                            <span :class="$style['tip-text']">{{ $text('S_UPLOAD_FILE_SIZE_SUGGEST', memInfo.config.lang) }}</span>
                            <span :class="$style['tip-size']">500 KB</span>
                            <span :class="$style['tip-text']">，</span>
                            <span :class="$style['tip-text']">{{ $text('S_UPLOAD_FILE_SIZE_LIMIT', memInfo.config.lang) }}</span>
                            <span :class="$style['tip-size']">2 MB</span>
                        </p>
                    </dropzone>
                </div>
            </div>
            <div class="content clearfix">
                <!-- 背景颜色設定 -->
                <div :class="['field', $style['bg-color']]">
                    <label>{{ $text('S_BACKGROUND_COLOR', memInfo.config.lang) }}</label>
                    <color-picker
                        :color-val="background['background-color']"
                        :on-change="(val) => { onBgChange('background-color', val) }"
                    />
                </div>
                <!-- 背景 對齊/並排 設定 -->
                <div :class="['field', $style['bg-position-repeat']]">
                    <label>{{ $text('S_BACKGROUND_ALIGN', memInfo.config.lang) }}</label>
                    <position-site
                        :align-val="background['background-position']"
                        :disabled="!background['background-image']"
                        :on-change="(val) => { onBgChange('background-position', val) }"
                    />
                    <label :class="$style['bg-repeat-label']">{{ $text('S_BACKGROUND_REPEAT', memInfo.config.lang) }}</label>
                    <semantic-dropdown
                        :options="bgRepeatOption"
                        :disabled="!background['background-image']"
                        :on-change="(val) => { onBgChange('background-repeat', val) }"
                    />
                </div>
            </div>
        </div>
        <div :class="['ui', 'form', 'content', $style.line]">
            <div :class="$style.title">
                <span>{{ $text('S_CATEGORY_BUTTON') }}</span>
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
                v-for="(info, type) in categoryColor"
                :key="type"
                class="clearfix"
            >
                <div
                    v-for="(value, key) in info"
                    :key="`${type}-${key}`"
                    :class="$style['color-wrap']"
                >
                    <label>{{ $text(`S_${type.toUpperCase()}_${key.toUpperCase()}`) }}</label>
                    <color-picker
                        :color-val="value"
                        :disabled="!buttonStyle"
                        :on-change="(val) => { onChange(type, key, val) }"
                    />
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
import dropzone from '@/components/dropzone';
import colorPicker from '@/components/colorPicker';
import positionSite from '@/components/positionSite';
import semanticDropdown from '@/components/semanticDropdown';

export default {
    components: {
        colorPicker,
        positionSite,
        semanticDropdown,
        dropzone
    },
    props: {
        element: {
            type: Object,
            default: null
        }
    },
    data() {
        const { setting } = this.element.case;
        const temp = JSON.parse(setting.category);
        const background = {
            'background-color': setting['background-color'],
            'background-image': setting['background-image'],
            'background-position': setting['background-position'],
            'background-repeat': setting['background-repeat']
        };
        const buttonStyle = temp['button-style'];
        const categoryColor = { button: temp.button, text: temp.text };

        return {
            background,
            buttonStyle,
            categoryColor,
            dropStyle: {
                width: '600px',
                height: '250px',
                'border-radius': '3px'
            },
            isSubmitting: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        /**
         * 取得背景重複方式
         * @method bgRepeatOption
         * @returns {array} 給下拉選單使用的 option
         */
        bgRepeatOption() {
            const repeat = this.background['background-repeat'];

            return [
                {
                    name: this.$text('S_DISPLAY_NOT_SIDE_BY_SIDE', this.memInfo.config.lang),
                    value: 'no-repeat',
                    selected: repeat === '' || repeat === 'no-repeat'
                },
                {
                    name: this.$text('S_DISPLAY_SIDE_BY_SIDE', this.memInfo.config.lang),
                    value: 'repeat',
                    selected: repeat === 'repeat'
                },
                {
                    name: this.$text('S_DISPLAY_H_SIDE_BY_SIDE', this.memInfo.config.lang),
                    value: 'repeat-x',
                    selected: repeat === 'repeat-x'
                },
                {
                    name: this.$text('S_DISPLAY_V_SIDE_BY_SIDE', this.memInfo.config.lang),
                    value: 'repeat-y',
                    selected: repeat === 'repeat-y'
                }
            ];
        }
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
         * 背景更新，設定 data 資料
         * @method onBgChange
         * @param {string} prop - 背景資料的 key 值
         * @param {string} val - 更新背景資料的值
         */
        onBgChange(prop, val) {
            this.background = {
                ...this.background,
                [prop]: val
            };
        },
        onChange(type, key, value) {
            this.categoryColor = {
                ...this.categoryColor,
                [type]: {
                    ...this.categoryColor[type],
                    [key]: value
                }
            };
        },
        /**
         * 上傳圖片
         * @method onUpload
         * @param {string} type - 上傳類型
         * @param {number} id - 當前檔案 id
         * @param {string} name - 檔案名稱
         * @param {object} response - 上傳後 server 回傳資料
         */
        onUpload(id, name, response) {
            if (response.status !== 'Y') {
                return;
            }

            this.background = {
                ...this.background,
                'background-image': response.data.link
            };
        },
        /**
         * 移除圖片
         * @method onRemove
         */
        onRemove() {
            this.background = {
                ...this.background,
                'background-image': ''
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

            const category = {
                ...this.categoryColor,
                'button-style': this.buttonStyle
            };
            const setting = {
                ...this.element.case.setting,
                ...this.background,
                category: JSON.stringify(category)
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

    .drop-wrap {
        position: relative;
    }

    .default-block {
        top: 59px !important;
        text-align: center;

        img {
            margin: 0 auto 8px;
        }
    }

    .custom-color {
        width: 199px !important;
    }

    .type-list {
        color: #D2D2D2;
        font-size: 14px;
    }

    .reminder {
        margin: 14px auto 0;
    }

    .tip-text {
        color: #131304;
        font-size: 13px;
    }

    .tip-size {
        color: #1783D2;
        font-size: 13px;
        font-weight: bold;
        text-decoration: underline;
    }
}

.main-title {
    line-height: initial;
    padding: 1.5rem 1.5rem 0;
    font-size: 19px;
}

.image {
    margin-bottom: 30px;
}

.line {
    border-top: 1px solid #E1E1E1;
}

.title {
    span {
        margin-right: 15px;
    }
}

.radio-text {
    font-size: 14px;
}

.color-wrap {
    float: left;
    width: 226px;
    margin: 15px 20px 0;
    border: 1px solid #E1E1E1;

    label {
        display: block;
        width: 194px;
        margin: 5px auto 0;
    }
}

.bg-color {
    float: left;
    margin: 0 30px 0 0 !important;
}

.bg-position-repeat {
    clear: none !important;
    float: left;
    min-width: 346px;
}

.bg-repeat-label {
    margin-top: 16px !important;
}
</style>
