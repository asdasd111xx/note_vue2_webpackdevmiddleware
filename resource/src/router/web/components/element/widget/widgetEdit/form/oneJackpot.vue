<template>
    <div :class="$style['form-one-text']">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
        <div :class="$style['jackpot-setting-box']">
            <div :class="$style['jackpot-text']">
                <field-input
                    :value="caseData[selectedIndex].preText[curLang]"
                    :on-input="(e) => updateJPData(e, 'preText')"
                    class="jackpot-input"
                />
                <field-select
                    :class="$style['jackpot-select']"
                    :options="fontSizeOption"
                    :value.sync="preFontSize"
                />
                <colorPicker :value-color.sync="preFontColor" class="jackpot-color-wrap" />
            </div>
            <div :class="$style['jackpot-text']">
                <field-input
                    :value="caseData[selectedIndex].endText[curLang]"
                    :on-input="(e) => updateJPData(e, 'endText')"
                    class="jackpot-input"
                />
                <field-select
                    :class="$style['jackpot-select']"
                    :options="fontSizeOption"
                    :value.sync="endFontSize"
                />
                <colorPicker :value-color.sync="endFontColor" class="jackpot-color-wrap" />
            </div>
            <div :class="$style['jackpot-text']">
                <field-select
                    :class="$style['jackpot-select']"
                    :options="fontSizeOption"
                    :value.sync="jpFontSize"
                />
                <colorPicker :value-color.sync="jpFontColor" class="jackpot-color-wrap" />
            </div>
            <div :class="$style['site-link-box']">
                <field-select
                    :title="'總彩金平台'"
                    :options="vendorList"
                    :value.sync="vendor"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import fieldSelect from '../fields/fieldSelect';
import fieldInput from '../fields/fieldInput';
import colorPicker from '../fields/colorPicker';

export default {
    components: {
        fieldSelect,
        fieldInput,
        colorPicker
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
            element: null,
            vendorList: [
                {
                    label: this.$text('S_BBCASINO', 'BB电子'),
                    value: 'bbin'
                },
                {
                    label: this.$text('S_JDB', 'JDB电子'),
                    value: 'jdb'
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang',
            gameData: 'getGameData'
        }),
        fontSizeOption() {
            const option = [];

            for (let i = 12; i < 73; i += 1) {
                option.push({ label: `${i}`, value: `${i}` });
            }

            return option;
        },
        vendor: {
            get() {
                return this.caseData[this.selectedIndex].vendor[this.curLang];
            },
            set(value) {
                this.updateJPData(value, 'vendor');
            }
        },
        preFontSize: {
            get() {
                return this.caseData[this.selectedIndex].preFontSize[this.curLang];
            },
            set(value) {
                this.updateJPData(value, 'preFontSize');
            }
        },
        endFontSize: {
            get() {
                return this.caseData[this.selectedIndex].endFontSize[this.curLang];
            },
            set(value) {
                this.updateJPData(value, 'endFontSize');
            }
        },
        preFontColor: {
            get() {
                return this.caseData[this.selectedIndex].preFontColor[this.curLang];
            },
            set(value) {
                this.updateJPData(value, 'preFontColor');
            }
        },
        endFontColor: {
            get() {
                return this.caseData[this.selectedIndex].endFontColor[this.curLang];
            },
            set(value) {
                this.updateJPData(value, 'endFontColor');
            }
        },
        jpFontSize: {
            get() {
                return this.caseData[this.selectedIndex].jpFontSize[this.curLang];
            },
            set(value) {
                this.updateJPData(value, 'jpFontSize');
            }
        },
        jpFontColor: {
            get() {
                return this.caseData[this.selectedIndex].jpFontColor[this.curLang];
            },
            set(value) {
                this.updateJPData(value, 'jpFontColor');
            }
        }
    },
    methods: {
        updateJPData(value, inputBox) {
            const cloneData = cloneDeep(this.caseData);
            cloneData[this.selectedIndex][inputBox][this.curLang] = value;
            this.updateCase(cloneData);
        }
    }
};
</script>

<style lang="scss" scoped>
    /deep/.jackpot-input {
        display: inline-block;

        .input {
            height: 40px;
        }
    }

    .jackpot-color-wrap {
        display: inline-block;
        width: 75px;
        vertical-align: middle;
    }
</style>

<style lang="scss" module>
.jackpot-setting-box {
    float: left;
}

.jackpot-text {
    width: 315px;
    margin-bottom: 10px;
}

.jackpot-select {
    display: inline-block;
}

.site-link-box {
    float: left;
    padding: 10px 12px;
    width: 172px;
    min-height: 85px;
    border-radius: 2px;
    border: 1px solid #D5D5D5;
}
</style>
