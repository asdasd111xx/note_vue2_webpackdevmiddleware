<template>
    <div class="contact-us">
        <sidebar />
        <div class="content">
            <h1>{{ i18nList.contactUs[language] }}</h1>
            <div v-for="item in 4" :key="`contactUs${item}`">
                <!-- eslint-disable vue/no-v-html -->
                <p v-html="colorize(i18nList[`contactUsPart${item}`][language])" />
                <!-- eslint-enable vue/no-v-html -->
                <template v-if="item === 4">
                    <p>
                        &nbsp;&nbsp;
                        <span class="yellow">hh@1527.com</span>
                        [{{ i18nList.commonQuestion[language] }}]
                    </p>
                    <p>
                        &nbsp;&nbsp;
                        <span class="yellow">ag@1527.com</span>
                        [{{ i18nList.proxyJoin[language] }}]
                    </p>
                    <p>
                        &nbsp;&nbsp;
                        <span class="yellow">ceo@1527.com</span>
                        [{{ i18nList.complaintAdvice[language] }}]
                    </p>
                    <p>
                        &nbsp;&nbsp;
                        <span>{{ i18nList.emailFeedback[language] }}</span>
                    </p>
                </template>
            </div>
            <p>
                <span>{{ i18nList.freeContact[language] }}</span>
                <span class="yellow">+639561666999</span>
            </p>
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
        colorize(val) {
            const colorAdd = val.includes('%y') ? 'yellow' : 'red';
            const replaceList = { yellow: '%y', red: '%s' };
            return [`<span class="${colorAdd}">`, '</span>']
                .reduce((init, newVal) => init.replace(replaceList[colorAdd], newVal),
                    val);
        }
    }
};
</script>


<style lang="scss" scoped>
.contact-us {
    padding: 20px 20px 0;

    .content {
        display: inline-block;
        vertical-align: top;
        margin-left: 25px;
        width: 710px;
        color: #FFF;

        h1 {
            color: #867B7C;
            font-size: 14px;
            font-weight: bold;
            line-height: 25px;
            margin-bottom: 35px;
        }

        p {
            color: #FFF;
            margin: 0;
            font-size: 12px;
            line-height: 26px;
        }

        /deep/ {
            .yellow {
                color: #FFD966;
            }

            .red {
                color: #FF0000;
            }
        }
    }
}
</style>
