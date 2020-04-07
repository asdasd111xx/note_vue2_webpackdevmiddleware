<template>
    <div class="common-question-wrap">
        <sidebar />
        <div class="content">
            <h1>{{ i18nList.commonQuestion[language] }}</h1>
            <div class="common-question">
                <div
                    v-for="item in 6"
                    :key="`common-${item}`"
                    class="common"
                >
                    <p>
                        {{ item }}.
                        <span class="question">{{ i18nList[`commonQuestion${item}`][language] }}</span>
                    </p>
                    <p class="answer">{{ i18nList[`commonAnswer${item}`][language] }}</p>
                </div>
            </div>
            <div class="game-question">
                <h1>{{ i18nList.gameQuestion[language] }}</h1>
                <div
                    v-for="item in 10"
                    :key="`game-${item}`"
                    class="game"
                >
                    <p>
                        {{ item }}.
                        <span class="question">{{ i18nList[`gameQuestion${item}`][language] }}</span>
                    </p>
                    <p class="answer">{{ i18nList[`gameAnswer${item}`][language] }}</p>
                </div>
            </div>
            <div class="tech-question">
                <h1>{{ i18nList.techQuestion[language] }}</h1>
                <p class="question">{{ i18nList.techQuestion1[language] }}</p>
                <p v-for="item in 6" :key="`tech-answer${item}`">
                    {{ `${item}. ${i18nList[`techAnswer1${item}`][language]}` }}
                </p>
            </div>
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
    created() {
        const openLang = ['zh-tw', 'zh-cn', 'en'];
        this.language = openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
    }
};
</script>


<style lang="scss" scoped>
.common-question-wrap {
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
            margin-bottom: 16px;
        }

        .common-question,
        .game-question,
        .tech-question {

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
                margin: 0;
                color: #FFD053;
                font-size: 14px;
                font-weight: bold;
                background-color: #663333;
            }

            .question {
                color: #FF9933;
            }

            .answer {
                padding-left: 10px;
            }

            .promise {
                font-size: 12px;
                line-height: 22px;
                color: #FF8C00;
            }

            .reason {
                font-size: 12px;
                font-weight: bold;
                line-height: 22px;
                color: #FF6600;
            }
        }

        .common-question {
            margin-bottom: 15px;
        }

        .game-question {
            margin-bottom: 35px;
        }

        .tech-question {
            margin-bottom: 80px;
        }
    }
}
</style>
