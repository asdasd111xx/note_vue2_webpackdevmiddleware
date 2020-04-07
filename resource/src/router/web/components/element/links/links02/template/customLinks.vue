<template>
    <div class="custom-lnks-wrap">
        <element-draggable v-if="element.case.data.length" :element="element">
            <template v-for="(caseData, index) in element.case.data">
                <element-wrap
                    v-if="index < 6"
                    :key="`custom-link-${index}`"
                    :index="index"
                    :config="shadowConfig"
                    :element="element"
                    class="custom-link"
                >
                    <template slot="element">
                        <span
                            :style="mainStyle(caseData, index)"
                            :title="caseData.title[curLang]"
                            class="link-item"
                            @click="changePage(caseData)"
                            @mouseenter="linkIndex = index"
                            @mouseleave="linkIndex = -1"
                        >
                            {{ caseData.title[curLang] }}
                        </span>
                        <span v-if="index % 3 !== 2" :style="{ color: caseData.color[curLang] }">|</span>
                    </template>
                </element-wrap>
                <br v-if="index % 3 === 2" :key="`custom-br-${index}`" />
            </template>
        </element-draggable>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementDraggable from '../../../common/new/elementDraggable';
import elementWrap from '../../../common/new/elementWrap';

export default {
    components: {
        elementDraggable,
        elementWrap
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            shadowConfig: {
                ...this.config,
                casePanel: {
                    remove: false, // 刪除功能
                    sort: true, // 排序功能
                    edit: true // 編輯功能
                },
                casePanelStyle: { // 注意！調整時請搜尋 shadowConfig
                    ...this.config.casePanelStyle,
                    offset: {
                        top: -17,
                        left: 6
                    }
                }
            },
            linkIndex: -1
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        mainStyle({ color, colorHover }, index) {
            if (!colorHover[this.curLang]) {
                return { color: color[this.curLang] };
            }

            return {
                color: this.linkIndex === index ? colorHover[this.curLang] : color[this.curLang]
            };
        },
        changePage({ linkTo, linkType, linkItem }) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({
                page: linkTo[this.curLang],
                type: linkType[this.curLang],
                config: {
                    linkItem: linkItem ? linkItem[this.curLang] : ''
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.custom-lnks-wrap {
    position: relative;
    float: left;
    width: 30%;
    padding-top: 2px;
    text-align: center;
}

.custom-link {
    position: relative;
    display: inline-block;

    span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin: 5px 4px;
        font-size: 14px;
        vertical-align: middle;
    }

    .link-item {
        overflow: hidden;
        width: 56px;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
}
</style>
