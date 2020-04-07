<template>
    <div
        :class="['case-panel-wrap', { horizontal: config.casePanelStyle.type === 'h' }]"
        :style="casePanelPos"
    >
        <!-- 排序 -->
        <div v-if="config.casePanel.sort !== false" class="btn sort sort-icon clearfix">
            <icon :scale="config.casePanelStyle.casePanelSize" name="arrows-alt" />
        </div>
        <!-- 移除 -->
        <div
            v-if="config.casePanel.remove !== false"
            class="btn delete clearfix"
            @click.stop="removeCase(index)"
        >
            <icon :scale="config.casePanelStyle.casePanelSize" name="trash" />
        </div>
        <!-- 設置 -->
        <template v-if="hasEdit">
            <div class="btn edit clearfix" @click.stop="isEditing = index">
                <icon :scale="config.casePanelStyle.casePanelSize" name="cog" />
            </div>
            <!-- 版塊編輯 -->
            <case-edit
                v-if="isEditing !== ''"
                :edit-index="isEditing"
                :config="config"
                :element="element"
                @close="isEditing = ''"
            />
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

/**
 * 模塊項目控制項
 * @module element/common/casePanel
 * @param {number} index - 該項目在 element data 的索引值
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        caseEdit: () => import(/* webpackChunkName: 'caseEdit' */'./caseEdit')
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
            default: () => {}
        }
    },
    data() {
        let hasEdit = this.config.casePanel.edit;

        // 如果設定編輯功能為開啟的狀態，但未設定表單，則改為關閉
        if (hasEdit) {
            try {
                hasEdit = this.config.popupEdit.common.length > 0;
            } catch (err) {
                hasEdit = false;
            }
        }

        return {
            hasEdit,
            isEditing: '',
            casePanelPos: this.getPos()
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
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
                title: this.$t('S_DELETE_TIPS', this.memInfo.config.lang || 'zh-cn'),
                type: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.value) {
                    this.actionCaseSave({
                        case_id: this.element.i,
                        content: [...this.element.case.content.filter((item, i) => index !== i)],
                        field: [...this.element.case.data.filter((item, i) => index !== i)],
                        setting: { ...this.element.case.setting }
                    }).then((response) => {
                        if (response.status !== 'Y') {
                            this.$swal({
                                title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                                type: 'error'
                            });
                        }
                    });
                }
            });
        },
        /**
         * 取得控制項定位點
         * @method getPos
         * @example
         * getPos(); // returns { top: "5px", right: "10px" }
         * @returns {object} 定位資訊
         */
        getPos() {
            const { offset } = this.config.casePanelStyle;
            const casePanelPos = {};

            Object.keys(offset).forEach((pos) => {
                casePanelPos[pos] = `${offset[pos]}px`;
            });

            return casePanelPos;
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

    &.horizontal {
        .btn {
            float: left;
            margin-right: 1px;
        }
    }

    .btn {
        background-color: #333;
        margin-bottom: 2px;
        padding: 3px 5px;
        color: #C3C3C3;
        border-radius: 3px;
        cursor: pointer;

        &.sort {
            cursor: move;
        }

        svg {
            display: block;
            margin: 0 auto;
        }
    }
}
</style>
