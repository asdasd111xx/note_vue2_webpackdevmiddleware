<template>
    <div :class="mainClass" :style="getPosition">
        <!-- 排序 -->
        <div class="btn sort sort-icon clearfix">
            <icon :scale="config.casePanelStyle.casePanelSize" name="expand-arrows-alt" />
        </div>
        <!-- 移除 -->
        <div class="btn delete clearfix" @click.stop="removeCase(index)">
            <icon :scale="config.casePanelStyle.casePanelSize" name="trash-alt" />
        </div>
        <!-- 設置 -->
        <div class="btn edit clearfix" @click.stop="isEditing = true">
            <icon :scale="config.casePanelStyle.casePanelSize" name="cog" />
        </div>
        <!-- 版塊編輯 -->
        <case-edit
            v-if="isEditing"
            :edit-index="index"
            :config="config"
            :element="element"
            @close="isEditing = false"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import caseEdit from './caseEdit';

export default {
    components: {
        caseEdit
    },
    props: {
        index: {
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
        }
    },
    data() {
        return {
            isEditing: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        mainClass() {
            return {
                'case-panel-wrap': true,
                horizontal: this.config.casePanelStyle.type === 'h'
            };
        },
        /**
         * 取得控制項定位點
         * @method getPosition
         * @returns {object} 定位資訊
         */
        getPosition() {
            return Object.keys(this.config.casePanelStyle.offset).reduce((init, key) => ({
                ...init,
                [key]: `${this.config.casePanelStyle.offset[key]}px`
            }), {});
        }
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 移除 case
         * @method removeCase
         * @param { number } index - case 索引值
         */
        removeCase(index) {
            this.$swal({
                title: this.$text('S_DELETE_TIPS', this.memInfo.config.lang),
                type: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (!result.value) {
                    return;
                }

                this.actionCaseSave({
                    case_id: this.element.i,
                    content: [...this.element.case.content.filter((item, i) => index !== i)],
                    field: [...this.element.case.data.filter((item, i) => index !== i)],
                    setting: { ...this.element.case.setting }
                }).then(({ status, message }) => {
                    if (status === 'Y') {
                        return;
                    }

                    this.$swal({
                        title: message || this.$text('S_CONTACT_SERVICE', this.memInfo.config.lang),
                        type: 'error'
                    });
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.case-panel-wrap {
    position: absolute;
    z-index: 1;
    transition: opacity .5s;
    opacity: 0;

    .element:hover &,
    .other-wrap:hover & {
        opacity: 1;
    }

    .btn {
        background-color: #333;
        margin-bottom: 2px;
        padding: 3px 5px;
        color: #C3C3C3;
        border-radius: 3px;

        svg {
            display: block;
            margin: 0 auto;
        }
    }

    .sort {
        cursor: move;
    }

    .delete,
    .edit {
        cursor: pointer;
    }
}

.horizontal {
    .btn {
        float: left;
        margin-right: 1px;
    }
}
</style>
