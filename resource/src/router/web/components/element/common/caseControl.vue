<template>
    <div class="element-control-wrap">
        <div
            v-if="info.remove !== false"
            class="remove-icon"
            @click="$emit('removeCase', info.index)"
        />
        <div v-if="info.sort !== false" class="sort-icon" />
        <div
            v-if="customEdit"
            class="edit-icon"
            @click="$emit('edit', info.index)"
        >
            <i class="setting icon" />
        </div>
        <template v-if="editItem.length > 0">
            <div class="edit-icon" @click="$emit('edit', info.index)">
                <i class="setting icon" />
            </div>
            <!-- 版塊編輯 -->
            <case-edit
                :edit-index="isEditing"
                :element="element"
                :list="editItem"
                :recommend-size="recommendSize"
                @close="onEditClose"
            />
        </template>
        <v-style :style-data="styleData" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import caseEdit from './caseEdit';

export default {
    components: {
        caseEdit
    },
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        editItem: {
            type: Array,
            default: () => []
        },
        element: {
            type: Object,
            default: () => {}
        },
        customEdit: {
            type: Boolean,
            default: false
        },
        recommendSize: {
            type: Array,
            default: () => []
        }
    },
    data() {
        const styleData = {
            common: [
                {
                    // eslint-disable-next-line
                    className: `.element-control-wrap .sort-icon[${this.$options._scopeId}]`,
                    path: '/static/image/common/icon_block.png'
                },
                {
                    // eslint-disable-next-line
                    className: `.element-control-wrap .remove-icon[${this.$options._scopeId}]`,
                    path: '/static/image/common/btn_close2.png'
                }
            ]
        };

        return {
            isEditing: '',
            styleData
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    mounted() {
        if (this.isBackEnd) {
            this.$on('edit', this.onEdit);
        } else {
            this.$off('removeCase', this.removeCase);
        }
    },
    methods: {
        onEdit(index) {
            this.isEditing = index;
        },
        onEditClose() {
            this.isEditing = '';
        }
    }
};
</script>
<style lang="scss" scoped>
.element-control-wrap {
    .sort-icon {
        margin-bottom: 3px;
        width: 22px;
        height: 22px;
        border-radius: 3px;
        cursor: move;
        background-color: #333;
        background-position: 50% 50%;
        background-repeat: no-repeat;
    }
    .remove-icon {
        margin-bottom: 3px;
        width: 22px;
        height: 22px;
        border-radius: 3px;
        cursor: pointer;
        background-color: #333;
        background-position: 50% 50%;
        background-repeat: no-repeat;
    }
    .edit-icon {
        background-color: #333;
        width: 22px;
        height: 22px;
        text-align: center;
        border-radius: 3px;
        cursor: pointer;
        i {
            margin: 0;
            color: #B9B9B9;
        }
    }
}
</style>
