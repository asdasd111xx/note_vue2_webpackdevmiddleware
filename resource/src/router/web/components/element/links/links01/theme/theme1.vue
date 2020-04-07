<template>
    <div :class="[isBackEnd ? 'theme-box' : '', `theme-${element.theme}`]">
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
            class="tab"
        >
            <div
                v-for="(caseData, index) in linksData.case.data"
                :key="`case-${caseData[curLang]-index}`"
                class="tablinks"
                @mouseenter="updateHoverState(caseData,true)"
                @mouseleave="updateHoverState(caseData,false)"
            >
                <div>
                    <case-control
                        v-if="isBackEnd && !readOnly"
                        :info="{index}"
                        :element="element"
                        :custom-edit="true"
                        class="element-control-wrap"
                        @edit="editIndex(index,true)"
                        @removeCase="deleteItem(index)"
                    />
                    <div>
                        <button
                            :style="{'color': caseData.fontColor,
                                     'cursor':'pointer'}"
                            @click="changePage(caseData)"
                        >
                            {{ caseData.title[curLang] }}
                        </button>
                        <span>|</span>
                    </div>
                </div>
            </div>
        </element-draggable>
        <div
            v-if="isBackEnd && !readOnly"
            :class="{'is-disable': element.case.data.length >= maxItem, 'add-case': true }"
            @click="add"
        >
            {{ $t('S_ADD01', memInfo.config.lang || 'zh-cn') }}
        </div>
        <linksDialog
            v-if="isBackEnd && editState && !readOnly"
            :edit-index="isEditing"
            :element="element"
            @editContent="editContent"
            @close="editIndexClose"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import elementDraggable from '../../../common/elementDraggable';
import caseControl from '../../../common/caseControl';
import linksDialog from '../dialog/linksDialog';

export default {
    components: {
        elementDraggable,
        caseControl,
        linksDialog
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isEditing: '',
            linksData: {},
            editState: false,
            hoverState: false,
            inertValtime: 1000,
            maxItem: 8
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            nowpage: 'getNowpage',
            page: 'getPage',
            pageData: 'getPageData',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
            readOnly: 'getReadOnly'
        })
    },
    watch: {
        element(val) {
            this.linksData = cloneDeep(val);
            this.linksData.case.data.forEach((item) => {
                const data = item;
                data.fontColor = item.color[this.curLang];
            });
        }
    },
    created() {
        this.linksData = cloneDeep(this.element);
        this.linksData.case.data.forEach((item) => {
            const data = item;
            data.fontColor = item.color[this.curLang];
        });
        const self = this;
        setInterval(() => {
            self.linksData.case.data.forEach((item) => {
                const data = item;
                if (item.colorBlink[self.curLang] !== '' && item.colorBlink[self.curLang] !== item.color[self.curLang]) {
                    if (item.fontColor === item.color[self.curLang]) {
                        data.fontColor = item.colorBlink[self.curLang];
                    } else {
                        data.fontColor = item.color[self.curLang];
                    }
                }
                self.linksData = {
                    ...self.linksData,
                    case: {
                        ...self.linksData.case,
                        data: [
                            ...self.linksData.case.data
                        ]
                    }
                };
            });
        }, 1000);
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        editIndex(index, state) {
            this.editState = state;
            this.isEditing = index;
        },
        editIndexClose() {
            this.isEditing = '';
            this.editState = false;
        },
        deleteItem(index) {
            this.$emit('deleteCase', index);
        },
        add() {
            if (this.isBackEnd && this.element.case.data.length < this.maxItem) {
                this.$emit('addCase');
            }
        },
        editContent(postData) {
            this.$emit('editData', postData);
        },
        updateHoverState(caseData, state) {
            this.hoverState = state;
            const data = caseData;
            if (data.colorBlink[this.curLang] !== '' && data.colorBlink[this.curLang] !== data.color[this.curLang]) {
                return;
            }
            if (state) {
                data.fontColor = data.colorHover[this.curLang] ? data.colorHover[this.curLang] : data.color[this.curLang];
            } else {
                data.fontColor = data.color[this.curLang];
            }
        },
        changePage(item) {
            this.$emit('changePage', item);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.tab {
    overflow: auto;
    white-space: nowrap;
}
.tablinks{
    position: relative;
}

.tabTitle{
    float: left;
    text-align: center;
    padding: 5px;
    text-decoration: none;
}

.tablinks{
    background-color: inherit;
    outline: none;
    padding: 14px 16px;
    transition: 0.3s;
    font-size: 17px;
    min-width: 150px;
    max-width: 200px;
    display: inline-block;
    vertical-align: top;
}

.tablinks button{
    width: 100%;
    background-color: transparent;
}

.element-wrap {
    position: relative;
    box-sizing: border-box;
    text-align: center;

    &:hover {
        .add-case {
            opacity: 1;
        }
    }

    .theme-box {
        box-sizing: border-box;
        padding: 70px 0px;
        text-align: center;
    }
    .element-control-wrap{
        float: left;
    }

    .add-case {
        opacity: 0;
        position: absolute;
        bottom: 20px;
        left: 50%;
        background: #AFAFAF;
        margin-left: -66px;
        width: 132px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        transition: opacity .5s;

        &.is-disable {
            cursor: not-allowed;
        }
    }

    .theme-B {
        .element-box {
            margin: 0 auto;
            max-width: 680px;
        }
    }

    .theme-C {
        .tablinks {
            padding: 12px 12px 15px 0;
            font-size: 12px;
            min-width: auto;

            button {
                padding-right: 3px;
                color: #1B2A49;

                &:hover {
                    color: #6E0313;
                }
            }

            span {
                color: #1B2A49;

                &:hover {
                    color: #6E0313;
                }
            }
            &:last-child {
                span {
                    display: none;
                }
            }
        }
    }
}
</style>
