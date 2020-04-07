<template>
    <div
        v-if="isBackEnd"
        ref="component-modal"
        class="ui modal large"
    >
        <div class="header">
            <i class="edit outline large icon" /> {{ $text('S_EDIT', memInfo.config.lang) }}
            <div class="modal-close" />
        </div>
        <div class="content clearfix">
            <template v-for="(list, key) in options">
                <div :key="key" :class="$style[key]">
                    <template v-for="info in list">
                        <div :key="info.key" :class="$style.case">
                            <div :class="$style.title">{{ info.text }}</div>
                            <component
                                :is="`edit-${info.key}`"
                                v-if="['content'].includes(info.key)"
                                v-model="content"
                                :disable="field.link[curLang] !== ''"
                            />
                            <component
                                :is="`edit-${info.key}`"
                                v-else-if="['category', 'image'].includes(info.key)"
                                v-model="field"
                                :element="element"
                            />
                            <component
                                :is="`edit-${info.key}`"
                                v-else
                                v-model="field"
                            />
                        </div>
                    </template>
                </div>
            </template>
        </div>
        <div class="actions">
            <div :class="['ui', 'button', 'primary', { disabled: submitting }]" @click="onComfirm">{{ $text('S_CONFIRM', memInfo.config.lang) }}</div>
            <div class="ui small button" @click="onClose">{{ $text('S_CLOSE', memInfo.config.lang) }}</div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isURL from 'validator/lib/isURL';
import editJoin from './editJoin';
import editDisplay from './editDisplay';
import editCategory from './editCategory';
import editDate from './editDate';
import editImage from './editImage';
import editLink from './editLink';
import editContent from './editContent';
import inputCkeditor from '../../../common/new/fields/inputCkeditor';
import imageUpload from '../../../common/new/fields/imageUpload';

export default {
    components: {
        editJoin,
        editDisplay,
        editCategory,
        editDate,
        editImage,
        editLink,
        editContent,
        inputCkeditor,
        imageUpload
    },
    props: {
        editIndex: {
            type: Number,
            required: true
        },
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            required: true
        },
        reRender: {
            type: Function,
            default: null
        }
    },
    data() {
        const field = cloneDeep(this.element.case.data[this.editIndex]);
        const content = cloneDeep(this.element.case.content[this.editIndex]);

        return {
            field,
            content,
            submitting: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        options() {
            return {
                left: [
                    {
                        key: 'join',
                        text: this.$text('S_PROMOTION_JOIN_BUTTON_2', '加入优惠按钮')
                    },
                    {
                        key: 'display',
                        text: this.$text('S_CLIENT_DISPLAY', '前台呈现')
                    },
                    {
                        key: 'category',
                        text: this.$text('S_CATEGORY_BUTTON_2', '优惠类別')
                    },
                    {
                        key: 'date',
                        text: this.$text('S_PROMOTION_TIME_SET', '上架/下架设定')
                    }
                ],
                right: [
                    {
                        key: 'image',
                        text: this.$text('S_IMG_UPLOAD', '图片上传')
                    },
                    {
                        key: 'link',
                        text: this.$text('S_CEP_OUT_LINK', '外部连结')
                    },
                    {
                        key: 'content',
                        text: this.$text('S_CONTENT_EDIT', '内容编修')
                    }
                ]
            };
        }
    },
    mounted() {
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onVisible: () => {
                setTimeout(() => {
                    $(window).trigger('resize');
                }, 100);
            },
            onHidden: () => {
                this.$emit('close');
            }
        });
        $(this.$refs['component-modal']).modal('show');
    },
    beforeDestroy() {
        this.onClose();
        $(this.$refs['component-modal']).modal('destroy');
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 送出表單
         * @method onComfirm
         */
        onComfirm() {
            // 防連點
            if (this.submitting) {
                return;
            }

            // 圖片檢查
            if (!this.field.card[this.curLang] || !this.field.image[this.curLang]) {
                this.$swal({ title: this.$text('S_IMG_NOT_UPLOAD', '图片未上传'), type: 'warning' });
                return;
            }

            // 顯示加入優惠按鈕須關連一則本站優惠
            if (this.field.join[this.curLang] === '1' && this.field.connect[this.curLang] === '') {
                return;
            }

            // 檢查外部連結
            if (this.field.link[this.curLang] !== '' && !isURL(this.field.link[this.curLang])) {
                return;
            }

            this.submitting = true;

            const fieldData = cloneDeep(this.element.case.data).map((info, index) => {
                if (index === this.editIndex) {
                    return this.field;
                }

                return info;
            });
            const contentData = cloneDeep(this.element.case.content).map((info, index) => {
                if (index === this.editIndex) {
                    return this.content;
                }

                return info;
            });

            this.actionCaseSave({
                case_id: this.element.i,
                content: contentData,
                field: fieldData,
                setting: this.element.case.setting
            }).then(({ status, message }) => {
                this.submitting = false;

                if (status !== 'Y') {
                    this.$swal({
                        title: message || this.$text('S_CONTACT_SERVICE', this.memInfo.config.lang),
                        type: 'error'
                    });

                    return;
                }

                this.onClose();
            });
        },
        /**
         * 關閉 semantic modal
         * @method onClose
         */
        onClose() {
            $(this.$refs['component-modal']).modal('hide');
        }
    }
};
</script>

<style lang="scss" module>
.left {
    float: left;
    width: 35%;
}

.right {
    float: right;
    width: 64%;
}

.case {
    margin-bottom: 10px;
    border: 1px solid #CECECE;
    border-radius: 5px;
}

.title {
    padding: 5px 15px;
    border-bottom: 1px solid #CECECE;
    border-radius: 5px 5px 0 0;
    background-color: #F5F6FA;
}
</style>
