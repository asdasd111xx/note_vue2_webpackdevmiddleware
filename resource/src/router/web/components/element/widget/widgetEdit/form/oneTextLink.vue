<template>
    <div :class="$style['form-one-text']">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
        <div :class="$style['input-text-wrap']">
            <div :class="$style.title">{{ $text('S_FONT', '文字') }}</div>
            <div :class="$style['text-wrap']">
                <input
                    v-model="textLink"
                    :class="$style['input-text-link']"
                    type="text"
                />
            </div>
            <div :class="$style['text-size-wrap']">
                <field-select
                    :title="$text('S_FONT_SIZE', { locale: memInfo.config.lang || 'zh-cn' })"
                    :value.sync="fontSizeValue"
                    :options="fontSizeOption"
                />
            </div>
            <div :class="$style['text-color-wrap']">
                <color-picker
                    :title="$text('S_FONT_COLOR', { locale: memInfo.config.lang || 'zh-cn' })"
                    :value-color.sync="textColor"
                />
            </div>
            <div :class="$style['text-color-wrap']">
                <color-picker
                    :title="$text('S_HOVER_COLOR', { locale: memInfo.config.lang || 'zh-cn' })"
                    :value-color.sync="textHover"
                />
            </div>
        </div>
        <div :class="$style['site-link-box']">
            <div :class="$style['site-link-title']">{{ $t('S_LINK', memInfo.config.lang || 'zh-cn') }}</div>
            <site-link
                :theme="$styleLinks"
                :value-type.sync="linkType"
                :value-to.sync="linkTo"
                :value-item.sync="linkItem"
            />
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
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink'),
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
        textColor: {
            get() {
                return this.caseData[this.selectedIndex].textColor;
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].textColor = value;
                this.updateCase(cloneData);
            }
        },
        textHover: {
            get() {
                return this.caseData[this.selectedIndex].textHover;
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].textHover = value;
                this.updateCase(cloneData);
            }
        },
        linkType: {
            get() {
                return this.caseData[this.selectedIndex].linkType[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].linkType[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        linkTo: {
            get() {
                return this.caseData[this.selectedIndex].linkTo[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].linkTo[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        linkItem: {
            get() {
                return this.caseData[this.selectedIndex].linkItem[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].linkItem[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        textLink: {
            get() {
                return this.caseData[this.selectedIndex].text[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].text[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        fontSizeValue: {
            get() {
                if (!this.caseData[this.selectedIndex].fontSize) {
                    return 16;
                }

                return this.caseData[this.selectedIndex].fontSize[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                if (!cloneData[this.selectedIndex].fontSize) {
                    cloneData[this.selectedIndex].fontSize = {};
                }

                cloneData[this.selectedIndex].fontSize[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        fontSizeOption() {
            const option = [];
            for (let index = 12; index < 31; index += 1) {
                option.push({ label: index, value: index.toString() });
            }

            return option;
        }
    }
};
</script>

<style lang="scss" module>
.site-link-box {
    float: left;
    margin-left: 20px;
    padding: 10px 12px;
    width: 172px;
    min-height: 170px;
    border-radius: 2px;
    border: 1px solid #D5D5D5;
}

.title {
    line-height: normal;
    font-size: 13px;
}

.input-text-wrap {
    float: left;
}

.text-wrap {
    position: relative;
    margin-bottom: 8px;
    height: 35px;
}

.text-color-wrap {
    float: left;
}

.text-size-select {
    width: 66px;
    height: 30px;
    padding: 0 10px;
    line-height: normal;
    border: 1px solid #D5D5D5;
    border-radius: 4px;
    font-size: 14px;
}

.text-size-wrap {
    position: relative;
    margin-bottom: 8px;
}

.input-text-link {
    height: 30px;
    padding: 0 10px;
    line-height: normal;
    border: 1px solid #D5D5D5;
    border-radius: 4px;
    font-size: 16px;
}
</style>

<style lang="scss" module="$styleLinks">
.field {
    margin-bottom: 14px;
    width: 100%;

    &:last-child {
        margin-bottom: 0
    }

    :global(.ui.input) {
        width: inherit;
    }
}
</style>
