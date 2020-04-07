<template>
    <div :class="$style['field-select-wrap']">
        <div v-if="title" :class="$style.title">{{ title }}</div>
        <Multiselect
            v-model="selectedValue"
            :placeholder="placeholder"
            :options="options"
            :searchable="searchable"
            :show-labels="false"
            track-by="value"
            label="label"
        >
            <span slot="noResult">{{ noResultText }}</span>
        </Multiselect>
    </div>
</template>

<script>
import find from 'lodash/find';
import Multiselect from 'vue-multiselect';

/**
 * 共用元件 - 下拉選單
 * @param {String} title - 標題
 * @param {String} placeholder - 預設文字
 * @param {String} options - 選單列表
 * @param {String} valueLink - 值
 * @param {String} [searchable=false] - 是否可以搜尋
 * @param {String} serchableNoDataText - 搜尋無資料時，呈現的文字
 */
export default {
    components: {
        Multiselect
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            required: true
        },
        value: {
            type: String,
            default: ''
        },
        searchable: {
            type: Boolean,
            default: false
        },
        serchableNoDataText: {
            type: String,
            default: ''
        }
    },
    computed: {
        selectedValue: {
            get() {
                if (this.value === '') {
                    return { label: '', value: '' };
                }

                return find(this.options, (items) => items.value === this.value);
            },
            set(selectedItem) {
                this.$emit('update:value', selectedItem.value);
            }
        },
        noResultText() {
            return this.serchableNoDataText || this.$text('S_NO_DATA_TPL', '查无任何资料');
        }
    }
};
</script>

<style lang="scss" module>
.field-select-wrap {

    .title {
        line-height: normal;
        font-size: 13px;
    }

    :global(.multiselect__option--highlight) {
        color: rgba(0, 0, 0, 0.87);
        background: rgba(0, 0, 0, 0.05);
    }
}
</style>
