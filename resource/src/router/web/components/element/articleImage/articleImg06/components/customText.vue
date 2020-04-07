<template>
    <div v-if="isShow" class="custom-text">
        <element-wrap
            :index="0"
            :config="shadowConfig"
            :element="element"
        >
            <template slot="element">
                <!-- eslint-disable vue/no-v-html -->
                <div v-html="contentText" />
                <!-- eslint-enable vue/no-v-html -->
            </template>
        </element-wrap>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import elementWrap from '../../../common/new/elementWrap';

/**
 * 內文文字
 * @module element/links/articleImg05/components/customText
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        elementWrap
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            shadowConfig: {
                ...this.config,
                casePanel: {
                    ...this.config.casePanel,
                    remove: false,
                    sort: false
                },
                casePanelStyle: {
                    ...this.config.casePanelStyle,
                    offset: {
                        top: 5,
                        right: 30
                    }
                }
            },
            content: '',
            isShow: 'false'
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        contentText() {
            let resultText = this.content;

            if (this.isBackEnd && this.element.case.content.length !== 0) {
                resultText = this.element.case.content[0][this.curLang];
            }

            return resultText;
        }
    },
    created() {
        if (this.isBackEnd) {
            this.isShow = true;
            return;
        }

        if (!this.element.case.content[0][this.curLang]) {
            return;
        }

        const url = `/tpl/${this.memInfo.user.domain}${this.element.case.content[0][this.curLang]}`;

        axios.get(url).then((response) => {
            this.content = response.data;
            this.isShow = true;
        });
    }
};
</script>

<style lang="scss" scoped>
.custom-text {
    position: relative;
    float: left;
    width: 25%;
    padding-right: 40px;
}
</style>
