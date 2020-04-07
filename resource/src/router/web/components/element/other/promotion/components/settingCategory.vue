<template>
    <div ref="component-modal" class="ui modal small">
        <div class="header">
            <i class="edit outline large icon" />{{ $text('S_PROMOTION_TEMPLATE_SET') }}
        </div>
        <div class="ui form content clearfix">
            <div :class="$style['title-wrap']">
                <span :class="$style.title">{{ $text('S_PROMOTION_CATEGORY', '优惠分类') }}</span>
                <span :class="$style.tips">{{ $text('S_PROMOTION_CATEGORY_TIPS', '最多可设置8个，全部优惠为固定项目') }}</span>
            </div>
            <div class="clearfix">
                <template v-for="(name, key, index) in lang">
                    <div :key="key" :class="['field', $style.lang]">
                        <label>{{ name }}</label>
                        <draggable v-model="sortDnd" :options="{ handle: `.${$style.bars}`, disabled: index }">
                            <template v-for="dndSort in sortDnd">
                                <div :key="dndSort" :class="[$style.list, 'clearfix']">
                                    <template v-if="!index">
                                        <span :class="$style.bars"><icon name="bars" /></span>
                                    </template>
                                    <input
                                        v-model="categoryDnd[dndSort][key].text"
                                        :class="{
                                            [$style.empty]: !categoryDnd[dndSort][key].text,
                                            [$style.error]: errorDnd[dndSort][key]
                                        }"
                                        :placeholder="$text('S_DAW_FILL_IN')"
                                        type="text"
                                    />
                                    <template v-if="!index && categoryDnd[dndSort][key].deletable">
                                        <span :class="$style.trash" @click="onDelete(dndSort)"><icon name="trash-alt" /></span>
                                    </template>
                                </div>
                            </template>
                        </draggable>
                        <div v-if="!index && sortDnd.length < 8" :class="[$style.create, 'clearfix']">
                            <span :class="$style.plus"><icon name="plus" /></span>
                            <span :class="$style.button" @click="onCreate">{{ $text('S_ADD') }}</span>
                        </div>
                    </div>
                </template>
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
import draggable from 'vuedraggable';

export default {
    components: {
        draggable
    },
    props: {
        element: {
            type: Object,
            default: null
        }
    },
    data() {
        const category = JSON.parse(this.element.case.setting['promotion-category']);
        const error = category.map((info) => Object.keys(info).reduce((init, lang) => ({
            ...init, [lang]: false
        }), {}));
        const sort = category.map((info, index) => index);

        return {
            category,
            error,
            sort,
            isSubmitting: false
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            memInfo: 'getMemInfo'
        }),
        categoryDnd: {
            get() {
                return this.category.map((info) => Object.keys(this.lang).reduce((init, lang) => ({
                    ...init,
                    [lang]: info[lang] ? info[lang] : info['zh-cn']
                }), {}));
            },
            set(category) {
                this.category = category;
            }
        },
        errorDnd: {
            get() {
                return this.error.map((warn) => Object.keys(this.lang).reduce((init, lang) => ({
                    ...init,
                    [lang]: warn[lang] ? warn[lang] : warn['zh-cn']
                }), {}));
            },
            set(error) {
                this.error = error;
            }
        },
        sortDnd: {
            get() {
                return this.sort;
            },
            set(sort) {
                this.sort = sort;
            }
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
        onCreate() {
            if (this.sortDnd.length > 7) {
                return;
            }

            const info = Object.keys(this.lang).reduce((init, lang) => ({
                ...init,
                [lang]: {
                    key: +new Date(),
                    deletable: true,
                    text: ''
                }
            }), {});
            const error = Object.keys(this.lang).reduce((init, lang) => ({
                ...init,
                [lang]: false
            }), {});
            const sort = this.category.length;

            this.categoryDnd = [...this.categoryDnd, info];
            this.errorDnd = [...this.errorDnd, error];
            this.sortDnd = [...this.sortDnd, sort];

            $(window).trigger('resize');
        },
        onDelete(index) {
            this.sortDnd = this.sortDnd.filter((value) => value !== index);

            $(window).trigger('resize');
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

            const category = this.sortDnd.map((index) => this.categoryDnd[index]);
            const error = category.some((info) => Object.keys(this.lang).some((lang) => !info[lang].text));

            if (error) {
                this.errorDnd = category.map((info) => Object.keys(info).reduce((init, lang) => ({
                    ...init,
                    [lang]: !info[lang].text
                }), {}));
                this.isSubmitting = false;
                return;
            }

            const setting = {
                ...this.element.case.setting,
                'promotion-category': JSON.stringify(category)
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
:global(.ui.form) {
    .lang {
        clear: none;
        position: relative;
        float: left;
        width: 31%;
        padding-bottom: 26px;

        &:first-child {
            .list {
                background-color: #FFF;

                input {
                    margin-left: 13px;
                    border-color: #FFF;
                    background-color: #FFF;
                }
            }
        }

        &:nth-child(3n+1) {
            width: 38%;

            .list {
                input {
                    width: calc(100% - 14px - 13px - 6px - 14px);
                }
            }
        }

        label {
            padding: 0 11px;
        }

        .list {
            margin: 6px 0;
            padding: 5px 11px;
            background-color: #F2F2F2;
            font-size: 14px;

            input {
                float: left;
                width: 100%;
                height: 24px;
                line-height: 22px;
                padding: 0 5px;
                border-color: #F2F2F2;
                background-color: #F2F2F2;

                &.empty,
                &:focus {
                    border-color: #CCC;
                    background-color: #FFF;
                }

                &.error {
                    border-color: #F00;
                }
            }
        }
    }
}

.title-wrap {
    margin-bottom: 30px;
    padding: 0 10px;
    color: rgba(0, 0, 0, 0.87);

    .title {
        margin-right: 3px;
        font-weight: bold;
        vertical-align: middle;
    }

    .tips {
        font-size: 12px;
        vertical-align: middle;
    }
}

.create {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 11px;
}

.icon {
    margin-top: 4px;
}

.bars {
    composes: icon;
    float: left;
    color: #D1D1D3;
    cursor: grab;
}

.trash {
    composes: icon;
    float: right;
    color: #999;
    cursor: pointer;
}

.plus {
    composes: icon;
    float: left;
    color: #D1D1D3;
}

.button {
    float: left;
    width: 90px;
    height: 26px;
    line-height: 26px;
    padding: 0 6px;
    margin-left: 13px;
    background-color: #798EB9;
    color: #FFF;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
}
</style>
