<template>
    <div :class="$style['pair-wrap']">
        <pair-input
            ref="xy"
            :value="[caseData[status.index].x, caseData[status.index].y]"
            :placeholder="['X', 'Y']"
            :disabled="caseData[status.index].draggable === 'N'"
            :title="$text('S_POSITION', { locale: memInfo.config.lang || 'zh-cn' })"
            :on-input="onXYChange"
            :on-blur="onXYBlur"
        >
            <div
                slot="icon"
                :class="caseData[status.index].draggable === 'Y' ? $style.unlock : $style.lock"
                @click="onLockerClick('draggable')"
            />
        </pair-input>
        <pair-input
            ref="wh"
            :value="[caseData[status.index].w, caseData[status.index].h]"
            :placeholder="['W', 'H']"
            :disabled="caseData[status.index].resizable === 'N'"
            :title="$text('S_SIZE', { locale: memInfo.config.lang || 'zh-cn' })"
            :on-input="onWHChange"
            :on-blur="onWHBlur"
        >
            <div
                slot="icon"
                :class="caseData[status.index].resizable === 'Y' ? $style.unlock : $style.lock"
                @click="onLockerClick('resizable')"
            />
        </pair-input>
        <!-- 為了避免被加了不符架構的需求，先隱藏欄位。工程師之魂不滅！ -->
        <!-- <single-input
            ref="rotate"
            :value="caseData[status.index].rotate"
            :on-input="onRotateChange"
            :on-blur="onRotateBlur"
            title="旋轉"
            placeholder="°"
        /> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isInt from 'validator/lib/isInt';
import pairInput from './pairInput';

export default {
    components: {
        pairInput
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
        },
        widgetRefs: {
            type: [Object, Array],
            required: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        onXYChange(e, index) {
            const { value } = e.target;
            if (isInt(value, { allow_leading_zeroes: false, min: 0 })) {
                this.onVectorChange(e.target.value, index === 0 ? 'x' : 'y');
            }
        },
        onWHChange(e, index) {
            const { value } = e.target;
            const option = {
                allow_leading_zeroes: false,
                min: index === 0 ? this.status.minw : this.status.minh
            };

            if (isInt(value, option)) {
                this.onVectorChange(e.target.value, index === 0 ? 'w' : 'h');
            }
        },
        onXYBlur(e) {
            if (!isInt(e.target.value, { allow_leading_zeroes: false, min: 0 })) {
                this.$refs.xy.$forceUpdate();
            }
        },
        onWHBlur(e, index) {
            const option = {
                allow_leading_zeroes: false,
                min: index === 0 ? this.status.minw : this.status.minh
            };

            if (!isInt(e.target.value, option)) {
                this.$refs.wh.$forceUpdate();
            }
        },
        onRotateChange(e) {
            if (isInt(e.target.value, { allow_leading_zeroes: false })) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.status.index].rotate = e.target.value;
                this.updateCase(cloneData);
            }
        },
        onRotateBlur(e) {
            if (!isInt(e.target.value, { allow_leading_zeroes: false })) {
                this.$refs.rotate.$forceUpdate();
            }
        },
        onVectorChange(inputVal, vector) {
            const result = cloneDeep(this.caseData);
            const maxLimit = {
                x: this.widgetRefs.$refs.vdr[this.status.index].calcDragLimits().maxLeft,
                y: this.widgetRefs.$refs.vdr[this.status.index].calcDragLimits().maxTop,
                w: this.widgetRefs.$refs.vdr[this.status.index].getParentSize()[0] - this.status.x,
                h: this.widgetRefs.$refs.vdr[this.status.index].getParentSize()[1] - this.status.y
            };
            const minLimit = {
                x: 0,
                y: 0,
                w: this.status.minw || 0,
                h: this.status.minh || 0
            };

            // 注意：因為當極值時，會將值 assign 成一固定值，造成子元件無法更新
            // 目前解法是先 assign 輸入的值，後面再做處理，待高手解決…
            result[this.status.index][vector] = +inputVal;
            this.updateCase(result);

            if (Number.isNaN(+inputVal) || inputVal >= maxLimit[vector] || inputVal <= minLimit[vector]) {
                this.$nextTick(() => {
                    if (inputVal >= maxLimit[vector]) {
                        result[this.status.index][vector] = +maxLimit[vector];
                    }

                    if (Number.isNaN(+inputVal) || inputVal <= minLimit[vector]) {
                        result[this.status.index][vector] = +minLimit[vector];
                    }

                    this.updateCase(cloneDeep(result));
                });
            }
        },
        onLockerClick(type) {
            const cloneData = cloneDeep(this.caseData);
            cloneData[this.status.index][type] = cloneData[this.status.index][type] === 'Y' ? 'N' : 'Y';
            this.updateCase(cloneData);
        }
    }
};
</script>

<style lang="scss" module>
.pair-wrap {
    float: left;
    margin-right: 20px;
}

.unlock {
    background: url('/static/image/element/widget/ui/tool_lock.png') 50% 0 no-repeat;
    position: absolute;
    top: 6px;
    left: 68px;
    margin-bottom: 14px;
    width: 13px;
    height: 14px;
    cursor: pointer;
}

.lock {
    composes: unlock;
    background-position: 50% 100%;
}
</style>
