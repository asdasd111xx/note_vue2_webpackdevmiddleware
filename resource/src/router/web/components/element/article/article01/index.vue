<template>
    <!-- 多產品板塊 -->
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="resultElement"
        :config="config"
    >
        <theme-default
            :element="resultElement"
            :config="config"
        />
    </main-wrap>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import config from './config';
import themeDefault from './template/themeDefault';

export default {
    components: {
        mainWrap: () => import(/* webpackChunkName: 'mainWrap' */'../../common/new/mainWrap'),
        themeDefault
    },
    props: {
        element: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            frontElement: this.element,
            config
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang'
        }),
        resultElement() {
            if (this.isBackEnd) {
                return this.element;
            }
            return this.frontElement;
        }
    },
    created() {
        this.syncData();
    },
    methods: {
        ...mapActions([
            'actionCaseSave',
            'actionChangePage'
        ]),
        /**
         * 同步異動資料
         */
        syncData() {
            const element = cloneDeep(this.element);
            let hasSync = false;

            // 舊資料 editContentState 為 Y/N，改為 ckeditor/link
            element.case.data.forEach((caseData, index) => {
                Object.keys(caseData.editContentState).forEach((lang) => {
                    if (['Y', 'N'].includes(caseData.editContentState[lang])) {
                        const transStatus = caseData.editContentState[lang] === 'Y' ? 'ckeditor' : 'link';
                        hasSync = true;
                        element.case.data[index].editContentState[lang] = transStatus;
                    }
                });
            });

            // 若資料正確直接中斷
            if (!hasSync) {
                return;
            }

            if (this.isBackEnd) {
                this.actionCaseSave({
                    case_id: this.element.i,
                    content: this.element.case.content,
                    field: element.case.data,
                    setting: { ...this.element.case.setting }
                }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE'),
                            type: 'error'
                        });
                    }
                });
                return;
            }

            // 客端的情況直接複蓋原始資料
            this.frontElement = element;
        }
    }
};
</script>
