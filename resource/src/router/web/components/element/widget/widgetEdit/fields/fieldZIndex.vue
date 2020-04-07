<template>
    <div :class="$style['z-btn-wrap']">
        <field-button :text="$text('S_MOVE_UP', { locale: memInfo.config.lang || 'zh-cn' })" @click="onZIndexClick('up')" />
        <field-button :text="$text('S_MOVE_DOWN', { locale: memInfo.config.lang || 'zh-cn' })" @click="onZIndexClick('down')" />
        <field-button :text="$text('S_MOVE_TOP', { locale: memInfo.config.lang || 'zh-cn' })" @click="onZIndexClick('top')" />
        <field-button :text="$text('S_MOVE_BOTTOM', { locale: memInfo.config.lang || 'zh-cn' })" @click="onZIndexClick('bottom')" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import fieldButton from './fieldButton';

export default {
    components: {
        fieldButton
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
        updateIndex: {
            type: Function,
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
        moveArr(arr, indexFrom, indexTo) {
            const tmpFrom = cloneDeep(arr[indexFrom]);

            // 注意：這邊是用 call by address 的方式在處理資料
            arr.splice(indexFrom, 1);
            arr.splice(indexTo, 0, tmpFrom);
        },
        changeIndex(index) {
            this.widgetRefs.onActivated({
                index,
                type: this.status.type,
                action: 'dragging'
            });
        },
        onZIndexClick(way) {
            const cloneData = cloneDeep(this.caseData);
            const selectedIndex = this.status.index;

            if ((way === 'up' || way === 'top') && selectedIndex === cloneData.length - 1) {
                return;
            }

            if ((way === 'down' || way === 'bottom') && selectedIndex === 0) {
                return;
            }

            switch (way) {
                case 'up':
                    this.moveArr(cloneData, selectedIndex, selectedIndex + 1);
                    this.changeIndex(selectedIndex + 1);
                    break;
                case 'down':
                    this.moveArr(cloneData, selectedIndex, selectedIndex - 1);
                    this.changeIndex(selectedIndex - 1);
                    break;
                case 'top':
                    this.moveArr(cloneData, selectedIndex, cloneData.length - 1);
                    this.changeIndex(cloneData.length - 1);
                    break;
                case 'bottom':
                    this.moveArr(cloneData, selectedIndex, 0);
                    this.changeIndex(0);
                    break;
                default:
                    break;
            }
            this.updateCase(cloneData);
        }
    }
};
</script>

<style lang="scss" module>
.z-btn-wrap {
    float: left;
    margin-right: 20px;
    width: 104px;
}
</style>
