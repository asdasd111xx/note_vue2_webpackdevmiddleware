<template>
    <div class="ui form clearfix">
        <site-link
            :theme="$style"
            :title="title"
            :value-type.sync="linkType"
            :value-to.sync="linkTo"
            :value-item.sync="linkItem"
            class="ui form three column grid setting-form"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

/**
 * 連結下拉選單
 * @module element/field/siteLink
 * @param {string|number} editIndex - 當前編輯項目索引值
 * @param {object} fieldConfig - 模塊當前欄位設定值
 * @param {object} element - 模塊資料
 * @param {object} value - 表單的值，雙向綁定
 */
export default {
    components: {
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink')
    },
    props: {
        editIndex: {
            type: [String, Number],
            required: true
        },
        fieldConfig: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            linkVal: {},
            title: {
                type: this.$text('S_LINK_TYPE', { text: '连结类型' }),
                to: this.$text('S_LINK', { text: '连结' })
            }
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        linkType: {
            get() {
                return this.value[this.fieldConfig.names.type];
            },
            set(value) {
                this.$emit('input', {
                    ...this.value,
                    [this.fieldConfig.names.type]: value
                });
            }
        },
        linkTo: {
            get() {
                return this.value[this.fieldConfig.names.to];
            },
            set(value) {
                this.$emit('input', {
                    ...this.value,
                    [this.fieldConfig.names.to]: value
                });
            }
        },
        linkItem: {
            get() {
                return this.value[this.fieldConfig.names.item];
            },
            set(value) {
                this.$emit('input', {
                    ...this.value,
                    [this.fieldConfig.names.item]: value
                });
            }
        }
    },
    mounted() {
        const initVal = {};
        Object.keys(this.fieldConfig.names).forEach((nameKey) => {
            const fieldName = this.fieldConfig.names[nameKey];
            try {
                initVal[fieldName] = this.defaultValSet(this.fieldConfig.setting, fieldName);
            } catch (err) {
                initVal[fieldName] = '';
            }
        });
        this.linkVal = initVal;

        this.$emit('input', initVal);
    },
    methods: {
        defaultValSet(settingState, fieldName) {
            if (settingState) {
                return this.element.case.setting[this.fieldConfig.objKey][fieldName];
            }

            return this.element.case.data[this.editIndex][fieldName][this.curLang];
        }
    }
};
</script>

<style lang="scss" module>
.site-link-wrap {
    .field {
        min-width: 216px;
        margin-bottom: 16px;
        padding: 16px;
    }
}

.title {
    margin-bottom: 4px;
    font-weight: bold;
}
</style>
