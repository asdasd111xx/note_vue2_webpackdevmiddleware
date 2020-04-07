<template>
    <div :class="$style['site-link-wrap']">
        <!-- 連結類型 -->
        <div :class="$style.field">
            <div v-if="title.type" :class="$style.title">{{ title.type }}</div>
            <model-select
                v-model="linkType"
                :options="linkTypeList"
            />
        </div>
        <!-- 自訂連結子項 -->
        <div v-if="linkType === 'internal'" :class="$style.field">
            <div v-if="title.to" :class="$style.title">{{ title.to }}</div>
            <model-select
                v-model="linkTo"
                :options="internalList"
            />
        </div>
        <!-- 固定連結 & 遊戲連結子項 -->
        <div v-if="links[linkType]" :class="$style.field">
            <div v-if="title.to" :class="$style.title">{{ title.to }}</div>
            <model-select
                v-model="linkTo"
                :options="linkToList"
            />
        </div>
        <!-- 外部連結 -->
        <div v-if="linkType === 'external'" :class="[$style.field]">
            <div v-if="title.to" :class="$style.title">{{ title.to }}</div>
            <div
                :aria-label="externalMsg"
                :class="externalInputClass"
            >
                <input
                    :value="linkTo"
                    type="text"
                    @input="onExternalChange"
                    @blur="onExternalBlur"
                />
            </div>
        </div>
        <!-- 遊戲細項 -->
        <div v-if="gameItemList.length" :class="$style.field">
            <div v-if="title.to" :class="$style.title">{{ title.to }}</div>
            <model-select
                v-model="linkItem"
                :options="gameItemList"
            />
        </div>
        <!-- 其它連結細項 -->
        <div v-if="itemList.length" :class="$style.field">
            <div v-if="title.to" :class="$style.title">{{ title.to }}</div>
            <model-select
                v-model="linkItem"
                :options="itemList"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ModelSelect } from 'vue-search-select';
import * as moment from 'moment-timezone';
import isURL from 'validator/lib/isURL';
import links from '@/config/links';

export default {
    components: {
        ModelSelect
    },
    props: {
        theme: {
            type: Object,
            default: null
        },
        title: {
            type: Object,
            default: () => ({})
        },
        valueType: {
            type: String,
            required: true
        },
        valueTo: {
            type: String,
            required: true
        },
        valueItem: {
            type: String,
            default: ''
        },
        // 不顯示的 link type 項目
        excludeType: {
            type: Array,
            default: () => []
        },
        relLogin: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isURLError: false
        };
    },
    computed: {
        ...mapGetters({
            systemTime: 'getSystemTime',
            page: 'getPage',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            gameData: 'getGameData',
            gameDetail: 'getGameDetail',
            linkDetail: 'getLinkDetail'
        }),
        $style() {
            return this.theme || this.$styleDefault;
        },
        externalInputClass() {
            return [
                'ui',
                'input',
                'hint--error',
                'hint--bottom',
                {
                    'hint--always': this.isURLError
                }
            ];
        },
        externalMsg() {
            const resultLang = this.memInfo.config.lang || 'zh-cn';
            return this.isURLError ? this.$t('S_WRONG_FORMAT', resultLang).replace('%s', 'url') : '';
        },
        /**
         * 重整 links 資料結構
         * @method links
         * @returns {object}} links 調整後資料
         */
        links() {
            // 排除開啟無限層後特例連結
            const resultLinks = links.static;

            return {
                ...links,
                static: resultLinks.filter((item) => {
                    if (item.stime && item.etime) {
                        // 檢查活動是否開放
                        const now = moment(this.systemTime * 1000).tz('Asia/Shanghai');
                        const start = moment(item.stime).tz('Asia/Shanghai');
                        const end = moment(item.etime).tz('Asia/Shanghai');

                        return now.isBetween(start, end);
                    }

                    if (item.value === 'casino') {
                        // 檢查所有 casino 平台是否開啟
                        return Object
                            .keys(this.gameData)
                            .some((key) => this.gameData[key].kind === 3 && this.gameData[key].switch === 'Y');
                    }

                    if (item.value === 'mobileBet') {
                        // 檢查 APP 是否開放下載
                        return this.memInfo.config.app_enable;
                    }

                    if (item.value === 'agLogin') {
                        // 檢查是否開放代理登入
                        return this.memInfo.config.agent_login;
                    }

                    return true;
                }),
                games: links.games.filter((info) => this.gameData[info.value].switch === 'Y')
            };
        },
        linkType: {
            get() {
                return this.valueType;
            },
            set(value) {
                this.$emit('update:valueType', value);

                this.$nextTick(() => {
                    this.$emit('update:valueTo', this.getLinkToDefault());
                    // 若這段不使用 $nextTick 執行，更新 caseData 會發兩次
                    // 因此更新 item 的時候，會再把 To 蓋回空字串
                    this.$nextTick(() => {
                        this.$emit('update:valueItem', this.getLinkItemDefault());
                    });
                });
            }
        },
        linkTo: {
            get() {
                return this.valueTo;
            },
            set(value) {
                this.$emit('update:valueTo', value);

                this.$nextTick(() => {
                    this.$emit('update:valueItem', this.getLinkItemDefault());
                });
            }
        },
        linkItem: {
            get() {
                return this.valueItem;
            },
            set(value) {
                this.$emit('update:valueItem', value);
            }
        },
        /**
         * 取得連結類型
         * @method linkTypeList
         * @returns {array}} 連結類型資料
         */
        linkTypeList() {
            return this.links.type
                .filter((link) => !this.excludeType.includes(link.value))
                .map((link) => ({
                    ...link,
                    text: this.$t(link.label, this.memInfo.config.lang || 'zh-cn')
                }));
        },
        /**
         * 取得連結目標
         * @method linkToList
         * @returns {array} 連結目標資料
         */
        linkToList() {
            return this.links[this.linkType]
                .filter((link) => (this.relLogin ? true : !link.relLogin))
                .map((link) => ({
                    ...link,
                    text: this.$t(link.label, this.memInfo.config.lang || 'zh-cn')
                }));
        },
        /**
         * 取得自訂頁面
         * @method internalList
         * @returns {array}} 自訂頁面資料
         */
        internalList() {
            const checkPage = (pageInfo) => {
                if (pageInfo.page_key) {
                    if (pageInfo.page_key === 'joinAgent') {
                        return !this.memInfo.config.infinity;
                    }
                    return false;
                }

                return pageInfo.page_type === 'custom';
            };

            return this.page.filter(checkPage).reduce((init, current) => {
                let subList = [];

                // 子頁面資料
                if (current.sub_page && current.sub_page.length) {
                    subList = current.sub_page.filter(checkPage).reduce((subInit, subCurrent) => [
                        ...subInit,
                        {
                            text: subCurrent.name[this.memInfo.config.lang] || subCurrent.name['zh-cn'],
                            value: `${subCurrent.page_id}`
                        }
                    ], []);
                }

                // 父子頁面資料壓平在同一個 array
                return [
                    ...init,
                    {
                        text: current.name[this.memInfo.config.lang] || current.name['zh-cn'],
                        value: `${current.page_id}`
                    },
                    ...subList
                ];
            }, []);
        },
        /**
         * 取得第三層細項連結
         * @method itemList
         * @returns {array} 第三層細項資料
         */
        itemList() {
            if (!this.linkDetail[this.linkTo]) {
                return [];
            }

            const listArr = this.linkDetail[this.linkTo].map((linkInfo) => ({
                text: linkInfo.name,
                value: linkInfo.code
            }));

            if (this.linkTo === 'promotion') {
                return listArr;
            }

            return [
                {
                    text: this.$t('S_PLEASE_SELECT', this.memInfo.config.lang || 'zh-cn'),
                    value: ''
                },
                ...listArr
            ];
        },
        /**
         * 取得遊戲細項連結
         * @method gameItemList
         * @returns {array} 遊戲細項資料
         */
        gameItemList() {
            if (!this.gameDetail[this.linkTo]) {
                return [];
            }

            const listArr = this.gameDetail[this.linkTo].map((gameInfo) => ({
                text: this.memInfo.config.lang === 'zh-tw' ? gameInfo.name : gameInfo.zh_cn_name,
                value: gameInfo.code
            }));

            if (this.linkTo === 'ky' || this.linkTo === 'yg') {
                return listArr;
            }

            return [
                {
                    text: this.$t('S_PLEASE_SELECT', this.memInfo.config.lang || 'zh-cn'),
                    value: ''
                },
                ...listArr
            ];
        }
    },
    methods: {
        onExternalChange(e) {
            this.isURLError = false;
            this.$emit('update:valueTo', e.target.value);
        },
        onExternalBlur(e) {
            this.isURLError = !isURL(e.target.value);
        },
        getLinkToDefault() {
            switch (this.linkType) {
                case 'internal':
                    return this.internalList[0].value;
                case 'static':
                case 'games':
                    return this.linkToList[0].value;
                case 'external':
                    return 'http://';
                case 'nolink':
                default:
            }
            return '';
        },
        getLinkItemDefault() {
            switch (true) {
                case !!this.gameItemList.length:
                    return this.gameItemList[0].value;
                case !!this.itemList.length:
                    return this.itemList[0].value;
                default:
            }
            return '';
        }
    }
};
</script>

<style lang="scss" module="$styleDefault">
.field {
    min-width: 148px;

    input {
        box-sizing: border-box;
    }
}
</style>
