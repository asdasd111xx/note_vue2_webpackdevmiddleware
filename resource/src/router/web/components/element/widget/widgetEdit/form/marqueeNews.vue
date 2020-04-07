<template>
    <div :class="$style['form-marquee-news']">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
        <div :class="$style['font-set-wrap']">
            <div :class="$style['font-size-wrap']">
                <fieldSelect
                    :title="$text('S_FONT_SIZE', { locale: memInfo.config.lang || 'zh-cn' })"
                    :options="fontSizeOption"
                    :value.sync="fontSize"
                />
            </div>
            <div :class="$style['font-color-wrap']">
                <colorPicker :title="$text('S_FONT_COLOR', { locale: memInfo.config.lang || 'zh-cn' })" :value-color.sync="color" />
            </div>
            <colorPicker :title="$text('S_FONT_COLOR_HOVER', { locale: memInfo.config.lang || 'zh-cn' })" :value-color.sync="colorHover" />
        </div>
        <div :class="$style['move-wrap']">
            <div :class="$style['direction-wrap']">
                <fieldSelect
                    :title="$text('S_MOVE_DIRECTION', { locale: memInfo.config.lang || 'zh-cn' })"
                    :options="directionOption"
                    :value.sync="direction"
                />
            </div>
            <div :class="$style['speed-wrap']">
                <div :class="$style.title">{{ $text('S_MOVE_SPEED', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                <div :class="`ui small input ${$style['input-speed']}`">
                    <input
                        v-model="speed"
                        @blur="(e) => { setSpeed(e.target.value) }"
                    />
                </div>
                <div :class="$style.description">{{ $text('S_RANGE_LIMIT', { locale: memInfo.config.lang || 'zh-cn' }) }}：85 ~ 500</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import colorPicker from '../fields/colorPicker';
import fieldSelect from '../fields/fieldSelect';

export default {
    components: {
        colorPicker,
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
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        fontSizeOption() {
            const option = [];

            for (let i = 12; i < 73; i += 1) {
                option.push({ label: `${i}`, value: `${i}` });
            }

            return option;
        },
        directionOption() {
            return [
                {
                    label: this.$text('S_TO_UP', { locale: this.memInfo.config.lang || 'zh-cn' }),
                    value: 'up'
                },
                {
                    label: this.$text('S_TO_DOWN', { locale: this.memInfo.config.lang || 'zh-cn' }),
                    value: 'down'
                },
                {
                    label: this.$text('S_TO_LEFT', { locale: this.memInfo.config.lang || 'zh-cn' }),
                    value: 'left'
                },
                {
                    label: this.$text('S_TO_RIGHT', { locale: this.memInfo.config.lang || 'zh-cn' }),
                    value: 'right'
                }
            ];
        },
        fontSize: {
            get() {
                return this.caseData[this.selectedIndex].fontSize[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].fontSize[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        color: {
            get() {
                return this.caseData[this.selectedIndex].color[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].color[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        colorHover: {
            get() {
                return this.caseData[this.selectedIndex].colorHover[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].colorHover[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        speed: {
            get() {
                return this.caseData[this.selectedIndex].speed[this.curLang];
            },
            set(value) {
                // 如設定的值不符合規範，則不更新
                if (+value < 85 || +value > 500) {
                    return;
                }

                this.setSpeed(value);
            }
        },
        direction: {
            get() {
                return this.caseData[this.selectedIndex].direction[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].direction[this.curLang] = value;
                this.updateCase(cloneData);
            }
        }
    },
    methods: {
        setSpeed(value) {
            // 當設定的值與目前相同時，則不更新
            if (value === this.caseData[this.selectedIndex].speed[this.curLang]) {
                return;
            }

            const setValue = (+value < 85 || +value > 500) ? this.caseData[this.selectedIndex].speed[this.curLang] : value;
            const cloneData = cloneDeep(this.caseData);
            cloneData[this.selectedIndex].speed[this.curLang] = setValue;
            this.updateCase(cloneData);
        }
    }
};
</script>

<style lang="scss" module>
.font-set-wrap {
    float: left;
    margin-right: 20px;
    max-width: 150px;

    .font-size-wrap,
    .font-color-wrap {
        margin-bottom: 8px;
    }
}

.move-wrap {
    float: left;
    margin-right: 20px;
    max-width: 155px;
}
.speed-wrap {
    .title,
    .description {
        line-height: normal;
        font-size: 13px;
    }
}
.direction-wrap {
    margin-bottom: 8px;
}
</style>
