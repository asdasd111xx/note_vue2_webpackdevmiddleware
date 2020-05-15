<template>
    <element-wrap
        :model-id="webInfo.model"
        :model-style-color="webInfo.style_color"
        :element="element"
        :theme-button="true"
        :theme="['A', 'B', 'C']"
        element-name="links01"
        class="is-links01"
    >
        <div>
            <theme1
                :element="element"
                @addCase="addCase"
                @editData="editData"
                @deleteCase="deleteCase"
                @sortData="sortData"
                @changePage="changePage"
            />
        </div>
    </element-wrap>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import positionTrans from '@/lib/position_trans';
import elementWrap from '../../common/elementWrap';

export default {
    components: {
        elementWrap,
        theme1: () => import(/* webpackChunkName: 'theme1' */'./theme/theme1')
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        elementIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isSetting: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            lang: 'getLang',
            nowpage: 'getNowpage',
            page: 'getPage',
            pageData: 'getPageData',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain'
        })
    },
    created() {
        if (this.isBackEnd && this.element.case.data.length === 0) {
            this.initCase();
        }
    },
    mounted() {
        if (this.isBackEnd) {
            this.$on('addCase', this.addCase);
            this.$on('toggleTheme', this.toggleTheme);
            this.$on('edit', this.onEdit);
            this.$on('setting', this.onSetting);
        }
    },
    methods: {
        ...mapActions([
            'actionElementSave',
            'actionCaseSave',
            'actionChangePage'
        ]),
        onSetting() {
            this.isSetting = this.element.i;
        },
        onSettingClose() {
            this.isSetting = '';
        },
        // 初始化
        initCase() {
            const eleData = '';
            const fieldData = [];

            eleData.data.forEach((data) => {
                const field = {};

                Object.keys(data).forEach((objKey) => {
                    Object.keys(this.lang).forEach((lang) => {
                        if (!field[objKey]) {
                            field[objKey] = {};
                        }
                        field[objKey][lang] = data[objKey];
                    });
                });
                fieldData.push(field);
            });

            this.updateField({
                field: [
                    ...this.element.case.data,
                    ...fieldData
                ],
                setting: {
                    ...this.element.case.setting,
                    ...eleData.setting
                }
            });
        },
        // 新增項目
        addCase() {
            if (!this.isBackEnd || this.element.case.data.length >= this.maxItem) {
                return;
            }

            const eleData = getElementInfo('links01', this.webInfo.model, this.webInfo.style_color);
            const field = {};

            Object.keys(eleData.data[0]).forEach((objKey) => {
                if (!field[objKey]) {
                    field[objKey] = {};
                }

                Object.keys(this.lang).forEach((lang) => {
                    field[objKey][lang] = eleData.data[0][objKey];
                });
            });

            this.updateField({
                field: [
                    ...this.element.case.data,
                    { ...field }
                ]
            });
        },
        // 修改
        editData(editItem) {
            const postData = {};
            postData.field = [...editItem.case.data];
            this.updateField(postData);
        },
        // 排序
        sortData(postData) {
            this.updateField(postData);
        },
        // 移除項目
        deleteCase(index) {
            this.updateField({
                field: [...this.element.case.data.filter((item, i) => index !== i)]
            });
        },
        updateField(data) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
                field: [...this.element.case.data],
                setting: { ...this.element.case.setting },
                ...data
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                }
            });
        },
        bgPosition(val) {
            return positionTrans(val);
        },
        changePage(item) {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: item.linkTo[this.curLang],
                    type: item.linkType[this.curLang],
                    config: {
                        linkItem: item.linkItem[this.curLang]
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";
.element-wrap {
    position: relative;
    box-sizing: border-box;
    text-align: center;

    &:hover {
        .add-case {
            opacity: 1;
        }
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
}
</style>
