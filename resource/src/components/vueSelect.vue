<template>
    <Multiselect
        v-model="selectedValue"
        :placeholder="placeholder"
        :options="options"
        :searchable="searchable"
        :show-labels="false"
        :class="$style['vue-select']"
        track-by="value"
        label="label"
    >
        <template slot="singleLabel" scope="{ option }">
            <slot :option="option" name="singleLabel">
                {{ option.label }}
            </slot>
        </template>
        <span slot="noResult">{{ noResultText }}</span>
    </Multiselect>
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
                return find(this.options, (items) => items.value === this.value);
            },
            set(selectedItem) {
                // 修正套件點擊同一個選項會 option 會變成 null 的問題
                if (!selectedItem) {
                    return;
                }
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
.vue-select {
    :global(.multiselect__option--highlight) {
        color: rgba(0, 0, 0, 0.87);
        background: rgba(0, 0, 0, 0.05);
    }
}
</style>
