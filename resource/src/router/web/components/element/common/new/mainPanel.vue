<template>
    <div class="main-panel">
        <div ref="dropdown-setting" class="ui icon circular teal mini top left pointing dropdown button">
            <icon name="wrench" />
            <div class="menu">
                <!-- 設置 -->
                <div
                    v-if="config.mainPanel.setting"
                    class="item"
                    @click="isSetting = element.i"
                >
                    <icon name="cogs" />
                    {{ $t('S_SETTINGS', memInfo.config.lang || 'zh-cn') }}
                </div>
                <!-- 複製至 -->
                <div v-if="config.mainPanel.copy" class="item">
                    <i class="dropdown icon" />
                    <span class="text">
                        <icon name="copy" />
                        {{ $t('S_COPY_TO', memInfo.config.lang || 'zh-cn') }}
                    </span>
                    <div class="right menu">
                        <div
                            v-for="(item, key) in pageOptions"
                            :key="key"
                            class="item"
                            @click="onCopy(item.page_id)"
                        >
                            {{ item.name[curLang] }}
                        </div>
                    </div>
                </div>
                <!-- 同步至 -->
                <div v-if="config.mainPanel.sync" class="item">
                    <i class="dropdown icon" />
                    <span>
                        <icon name="clone" />
                        {{ $t('S_SYNCHRONIZED_TO', memInfo.config.lang || 'zh-cn') }}
                    </span>
                    <div class="right menu">
                        <div
                            v-for="lang in langOptions"
                            :key="lang.type"
                            class="item"
                            @click="onSync(lang.type)"
                        >
                            {{ lang.name }}
                        </div>
                    </div>
                </div>
                <!-- 佈局 -->
                <div v-if="config.mainPanel.theme" class="item">
                    <i class="dropdown icon" />
                    <span>
                        <icon name="th" />
                        {{ $t('S_LAYOUT', memInfo.config.lang || 'zh-cn') }} {{ themeConverter[element.theme] }}
                    </span>
                    <div class="right menu">
                        <div
                            v-for="themeInfo in theme"
                            :key="`theme-${themeInfo.value}`"
                            class="item"
                            @click="changeTheme(element.i, themeInfo.value)"
                        >
                            {{ themeInfo.text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 版塊設定 -->
        <main-setting
            v-if="config.mainPanel.setting && isSetting !== ''"
            :setting-index="isSetting"
            :element="element"
            :config="config"
            @close="isSetting = ''"
        />
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import { elementInfo } from '@/config/elements';

/**
 * 模塊控制項(設置、複製、同步、佈局)
 * @module element/common/mainPanel
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        mainSetting: () => import(/* webpackChunkName: 'mainSetting' */'./mainSetting')
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
            isSetting: ''
        };
    },
    computed: {
        ...mapGetters({
            page: 'getPage',
            memInfo: 'getMemInfo',
            pageData: 'getPageData',
            nowpage: 'getNowpage',
            curLang: 'getCurLang',
            lang: 'getLang',
            allLanguage: 'getAllLanguage',
            webInfo: 'getWebInfo'
        }),
        /**
         * 取得語系選單項目
         * @method langOptions
         */
        langOptions() {
            return this.allLanguage
                .filter((lang) => this.lang[lang.type] && lang.type !== this.curLang);
        },
        /**
         * 取得頁面選單項目
         * @method pageOptions
         */
        pageOptions() {
            return this.page.filter((item) => {
                // 當前頁
                if (item.page_id === this.nowpage) {
                    return false;
                }

                // 固定頁面
                if (item.page_key) {
                    // 合營優勢
                    if (item.page_key === 'joinAgent') {
                        return !this.memInfo.config.infinity;
                    }

                    return true;
                }

                // 純連結
                return !('linkTo' in item);
            });
        },
        /**
         * 重新整理佈局資料
         * @method theme
         */
        theme() {
            return this.config.theme.map((theme) => {
                if (isObject(theme)) {
                    return theme;
                }

                return { text: theme, value: theme };
            }).filter((theme) => {
                if (theme.alias) {
                    return theme.alias.includes(this.webInfo.alias);
                }

                return true;
            });
        },
        themeConverter() {
            const themeObj = {};

            this.config.theme.forEach((theme) => {
                themeObj[theme.value] = theme.text;
            });

            return themeObj;
        }
    },
    mounted() {
        $(this.$refs['dropdown-setting']).dropdown({ on: 'hover', action: 'nothing', direction: 'downward' });
    },
    beforeDestroy() {
        // 卸載下拉選單
        $(this.$refs['dropdown-setting']).dropdown('destroy');
    },
    methods: {
        ...mapActions([
            'actionGetLayout',
            'actionCaseSave',
            'actionElementCopy',
            'actionElementSave'
        ]),
        /**
         * 複製資料至其它頁面
         * @method onCopy
         * @param {number} pageId - 目標頁面 id
         */
        onCopy(pageId) {
            this.actionGetLayout({ setNowPage: false, pageId }).then(() => {
                const copyData = cloneDeep(this.element);
                const pageData = this.pageData[pageId].data ? cloneDeep(this.pageData[pageId].data) : [];

                // 組件超過上限阻擋
                const modelQuantity = pageData.filter((el) => el.type === copyData.type).length;
                const upperLimit = elementInfo.filter((obj) => obj.value === copyData.type)[0].limit;

                if (modelQuantity >= upperLimit) {
                    alert(this.$t('S_PAGE_LIMIT', this.memInfo.config.lang || 'zh-cn'));
                    return;
                }

                copyData.i = '';
                pageData.push(copyData);

                const data = {
                    delete_id: [],
                    gridInfo: pageData,
                    page_id: pageId
                };
                this.actionElementCopy({ data }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE'),
                            type: 'error'
                        });
                    }
                });
            });
        },
        /**
         * 同步資料至其它語系
         * @method onSync
         * @param {object} lang - 目標語系
         */
        onSync(lang) {
            const syncData = cloneDeep(this.element);

            syncData.case.data = syncData.case.data.map((data, index) => {
                const result = cloneDeep(data);

                Object.keys(this.element.case.data[index])
                    .forEach((field) => {
                        result[field][lang] = data[field][this.curLang];
                    });
                return result;
            });

            syncData.case.content = syncData.case.content.map((data) => {
                const result = cloneDeep(data);

                result[lang] = data[this.curLang];
                return result;
            });

            this.actionCaseSave({
                case_id: syncData.i,
                content: [...syncData.case.content],
                field: [...syncData.case.data],
                setting: { ...syncData.case.setting }
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                        type: 'error'
                    });
                }
            });
        },
        /**
         * 切換模塊佈局
         * @method changeTheme
         * @param {number} caseId 當前模塊的 case id
         * @param {string} theme 佈局代號
         */
        changeTheme(caseId, theme) {
            const data = {
                delete_id: [],
                gridInfo: [
                    ...this.pageData[this.nowpage].data.map((info) => {
                        const result = cloneDeep(info);
                        if (result.i === caseId) {
                            return {
                                ...result,
                                theme
                            };
                        }
                        return { ...result };
                    })
                ],
                page_id: this.nowpage
            };
            this.actionElementSave({ data }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                        type: 'error'
                    });
                }
            });
        }
    }
};
</script>
