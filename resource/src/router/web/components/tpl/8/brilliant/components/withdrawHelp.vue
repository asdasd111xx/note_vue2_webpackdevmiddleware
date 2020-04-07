<template>
    <div class="withdraw-help">
        <sidebar />
        <div class="content">
            <h1>{{ i18nList.withdrawHelp[language] }}</h1>
            <!-- eslint-disable vue/no-v-html -->
            <div class="withdraw-method">
                <h2>{{ i18nList.withdrawMethod[language] }}</h2>
                <p
                    v-for="item in 4"
                    :key="`step-${item}`"
                    v-html="colorRed(i18nList[`withdrawStep${item}`][language])"
                />
                <p v-html="colorRed(i18nList.withdrawQA[language])" />
                <p>{{ i18nList.withdrawBankList[language] }}</p>
            </div>
            <div class="withdraw-note">
                <h2>{{ i18nList.withdrawNote[language] }}</h2>
                <p
                    v-for="item in 7"
                    :key="`note-${item}`"
                    v-html="colorRed(i18nList[`withdrawNote${item}`][language])"
                />
            </div>
            <!-- eslint-enable vue/no-v-html -->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import sidebar from './gameNav';
import i18nList from '../config/lang';

export default {
    components: {
        sidebar
    },
    data() {
        return {
            i18nList
        };
    },
    computed: {
        ...mapGetters({ curLang: 'getCurLang' }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    methods: {
        colorRed(val) {
            return ['<span class="red">', '</span>']
                .reduce((init, newVal) => init.replace('%s', newVal),
                    val);
        }
    }
};
</script>

<style lang="scss" scoped>
.withdraw-help {
    padding: 20px 20px 0;

    .content {
        display: inline-block;
        vertical-align: top;
        margin-left: 25px;
        width: 700px;

        h1 {
            color: #867B7C;
            font-size: 14px;
            font-weight: bold;
            line-height: 25px;
            margin-bottom: 27px;
        }

        .withdraw-method,
        .withdraw-note {
            p {
                color: #FFF;
                margin: 0;
                font-size: 12px;
                line-height: 26px;
            }

            h2 {
                width: 680px;
                line-height: 22px;
                padding: 4px 0 4px 5px;
                margin-bottom: 8px;
                color: #FFD053;
                font-size: 14px;
                font-weight: bold;
                background-color: #663333;
            }

            /deep/ .red {
                color: #FF0000;
            }
        }

        .withdraw-method {
            padding-bottom: 20px;
        }
    }
}
</style>
