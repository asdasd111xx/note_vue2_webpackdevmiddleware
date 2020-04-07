<template>
    <div :class="$style['form-one-text']">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
        <field-ckeditor
            :selected-index="selectedIndex"
            :value="caseData[selectedIndex].text[curLang]"
            :on-change="onChange"
        />
        <div :class="$style['site-link-box']">
            <div :class="$style['site-link-title']">{{ $t('S_LINK', memInfo.config.lang || 'zh-cn') }}</div>
            <site-link
                :theme="$styleLinks"
                :value-type.sync="linkType"
                :value-to.sync="linkTo"
                :value-item.sync="linkItem"
                :rel-login="true"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import fieldCkeditor from '../fields/fieldCkeditor';

export default {
    components: {
        fieldCkeditor,
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink')
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
            element: null
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
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
        }
    },
    methods: {
        onChange(e, content) {
            const cloneData = cloneDeep(this.caseData);
            cloneData[this.selectedIndex].text[this.curLang] = content;
            this.updateCase(cloneData);
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
