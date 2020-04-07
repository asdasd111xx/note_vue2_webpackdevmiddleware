<template>
    <div :class="$style['bg-wrap']">
        <border-input
            ref="border-input"
            :border-width="caseData[status.index].borderWidth"
            :border-color="caseData[status.index].borderColor"
            :title="$text('S_BORDER', { locale: memInfo.config.lang || 'zh-cn' })"
            :on-picker="onColorChange"
            :on-border-change="onBorderChange"
            :on-border-blur="onBorderBlur"
            placeholder="PX"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isInt from 'validator/lib/isInt';
import borderInput from './borderInput';

export default {
    components: {
        borderInput
    },
    props: {
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
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        onBorderChange(value) {
            if (isInt(value, { allow_leading_zeroes: false, min: 0 })) {
                const result = cloneDeep(this.caseData);

                result[this.status.index].borderWidth = value;
                this.updateCase(cloneDeep(result));
            }
        },
        onBorderBlur(value) {
            if (!isInt(value, { allow_leading_zeroes: false, min: 0 })) {
                this.$refs['border-input'].$forceUpdate();
            }
        },
        onColorChange(value) {
            const result = cloneDeep(this.caseData);

            result[this.status.index].borderColor = value;
            this.updateCase(cloneDeep(result));
        }
    }
};
</script>

<style lang="scss" module>
.bg-wrap {
    float: left;
    margin-right: 20px;
}
</style>
