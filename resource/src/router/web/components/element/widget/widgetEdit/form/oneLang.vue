<template>
    <div :class="$style['form-one-image']">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <div :class="$style['design-wrap']">
            <div :class="$style['lang-set-wrap']">
                <field-select
                    :value.sync="shapeType"
                    :options="shapeList"
                    :title="$text('S_SHAPE', '形状')"
                    class="select-set-wrap"
                />
            </div>
            <div :class="$style['lang-set-wrap']">
                <field-select
                    :value.sync="patternItem"
                    :options="patternList"
                    :title="$text('S_STYLE', '樣式')"
                    class="select-set-wrap"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import fieldSelect from '../fields/fieldSelect';

export default {
    components: {
        fieldSelect
    },
    props: {
        selectedIndex: {
            type: Number,
            required: true
        },
        caseData: {
            type: Array,
            default: () => []
        },
        status: {
            type: Object,
            required: true
        },
        updateCase: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            shapeList: [
                {
                    label: this.$text('S_CYCLE', '圆形'),
                    value: 'cycle'
                },
                {
                    label: this.$text('S_SQUARE', '方形'),
                    value: 'square'
                }
            ],
            patternList: [
                {
                    label: 'a',
                    value: 'a'
                },
                {
                    label: 'b',
                    value: 'b'
                },
                {
                    label: 'c',
                    value: 'c'
                },
                {
                    label: 'd',
                    value: 'd'
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        shapeType: {
            get() {
                return this.caseData[this.selectedIndex].shape[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].shape[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        patternItem: {
            get() {
                return this.caseData[this.selectedIndex].pattern[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].pattern[this.curLang] = value;
                this.updateCase(cloneData);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    /deep/.select-set-wrap {
        .multiselect__select {
            width: auto;
        }

        .multiselect__tags {
            padding-right: 25px;
        }
    }
</style>

<style lang="scss" module>
.design-wrap {
    float: left;
}

.lang-set-wrap {
    margin-right: 20px;
}
</style>
