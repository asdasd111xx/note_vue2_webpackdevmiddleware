<template>
    <div class="main-panel">
        <div ref="dropdown-setting" class="ui icon circular teal mini top left pointing dropdown button">
            <icon name="wrench" />
            <div class="menu">
                <!-- 設置 -->
                <div
                    v-for="info in options"
                    :key="info.value"
                    class="item"
                    @click="setName = info.value"
                >
                    <icon :name="info.icon" />
                    <span>{{ $text(info.text, memInfo.config.lang) }}</span>
                </div>
                <!-- 同步至 -->
                <div class="item">
                    <i class="dropdown icon" />
                    <span>
                        <icon name="clone" />
                        <span>{{ $text('S_SYNCHRONIZED_TO', memInfo.config.lang) }}</span>
                    </span>
                    <div class="right menu">
                        <div
                            v-for="lang in langOptions"
                            :key="lang.type"
                            class="item"
                            @click="onSync(lang.type)"
                        >
                            <span>{{ lang.name }}</span>
                        </div>
                    </div>
                </div>
                <!-- 佈局 -->
                <div class="item">
                    <i class="dropdown icon" />
                    <span class="text">
                        <icon name="th" />
                        <span>{{ $text('S_LAYOUT', memInfo.config.lang) }} {{ themeConverter[element.theme] }}</span>
                    </span>
                    <div class="right menu">
                        <div
                            v-for="themeInfo in theme"
                            :key="`theme-${themeInfo.value}`"
                            class="item"
                            @click="changeTheme(element.i, themeInfo.value)"
                        >
                            <span>{{ themeInfo.text }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 版塊設定 -->
        <component
            :is="template"
            :element="element"
            @close="onClose"
        />
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';

export default {
    components: {
        settingMain: () => import(/* webpackChunkName: 'settingMain' */'./settingMain'), // 設置
        settingCard: () => import(/* webpackChunkName: 'settingCard' */'./settingCard'), // 卡片設置
        settingArticle: () => import(/* webpackChunkName: 'settingArticle' */'./settingArticle'), // 文案設置
        settingCategory: () => import(/* webpackChunkName: 'settingCategory' */'./settingCategory') // 分類設置
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
            setName: '',
            options: [
                // 設置
                {
                    value: 'main',
                    text: 'S_SETTINGS',
                    icon: 'cogs'
                },
                // 卡片設置
                {
                    value: 'card',
                    text: 'S_CARD_SETTINGS',
                    icon: 'sticky-note'
                },
                // 文案設置
                {
                    value: 'article',
                    text: 'S_ARTICLE_SETTINGS',
                    icon: 'file-alt'
                },
                // 分類設置
                {
                    value: 'category',
                    text: 'S_CATEGORY_SETTINGS',
                    icon: 'list'
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            pageData: 'getPageData',
            nowpage: 'getNowpage',
            allLanguage: 'getAllLanguage',
            lang: 'getLang',
            curLang: 'getCurLang'
        }),
        template() {
            if (!this.setName) {
                return '';
            }

            return `setting-${this.setName}`;
        },
        /**
         * 取得語系選單項目
         * @method langOptions
         */
        langOptions() {
            return this.allLanguage.filter((lang) => this.lang[lang.type] && lang.type !== this.curLang);
        },
        /**
         * 重新整理佈局資料
         * @method theme
         */
        theme() {
            return this.config.theme.map((theme) => {
                if (_.isObject(theme)) {
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
                if (theme.value) {
                    themeObj[theme.value] = theme.text;
                    return;
                }
                themeObj[theme] = theme;
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
            'actionCaseSave',
            'actionElementSave'
        ]),
        /**
         * 同步資料至其它語系
         * @method onSync
         * @param {object} lang - 目標語系
         */
        onSync(lang) {
            const syncData = _.cloneDeep(this.element);

            syncData.case.data = syncData.case.data.map((data, index) => {
                const result = _.cloneDeep(data);

                Object.keys(this.element.case.data[index])
                    .forEach((field) => {
                        result[field][lang] = data[field][this.curLang];
                    });
                return result;
            });

            syncData.case.content = syncData.case.content.map((data) => {
                const result = _.cloneDeep(data);

                result[lang] = data[this.curLang];
                return result;
            });

            this.actionCaseSave({
                case_id: syncData.i,
                content: [...syncData.case.content],
                field: [...syncData.case.data],
                setting: { ...syncData.case.setting }
            }).then(({ status, message }) => {
                if (status === 'Y') {
                    return;
                }

                this.$swal({
                    title: message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang),
                    type: 'error'
                });
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
                        const result = _.cloneDeep(info);
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
            this.actionElementSave({ data }).then(({ status, message }) => {
                if (status === 'Y') {
                    return;
                }

                this.$swal({
                    title: message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang),
                    type: 'error'
                });
            });
        },
        onClose() {
            this.setName = '';
        }
    }
};
</script>
