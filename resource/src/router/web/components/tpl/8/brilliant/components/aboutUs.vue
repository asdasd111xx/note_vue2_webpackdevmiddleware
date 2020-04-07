<template>
    <div class="about-us">
        <sidebar />
        <div class="content">
            <h1>{{ i18nList.aboutUs[language] }}</h1>
            <div class="intro">
                <p class="margin-box">{{ i18nList.intro1[language] }}</p>
                <p class="margin-box">{{ i18nList.intro2[language] }}</p>
            </div>
            <div class="our-promise">
                <h2 class="title">{{ i18nList.ourPromise[language] }}</h2>
                <div
                    v-for="item in 8"
                    :key="`promise-${item}`"
                    class="promise-wrap margin-box"
                >
                    <span class="promise">{{ i18nList[`promise${item}`][language] }}</span>
                    <p>{{ i18nList[`promise${item}Content`][language] }}</p>
                </div>
            </div>
            <div class="bbin-amusement">
                <h2>{{ i18nList.bbinAmusementTitle[language] }}</h2>
                <p class="margin-box">{{ i18nList.bbinAmusementContent[language] }}</p>
            </div>
            <div class="ten-reasons">
                <h2>{{ i18nList.tenReasons[language] }}</h2>
                <div
                    v-for="item in 10"
                    :key="`reason${item}`"
                    class="reason-wrap margin-box"
                >
                    <span class="reason">{{ i18nList[`reason${item}`][language] }}</span>
                    <!-- eslint-disable vue/no-v-html -->
                    <p v-html="replaceText(i18nList[`reason${item}Content`][language])" />
                    <!-- eslint-enable vue/no-v-html -->
                </div>
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
    methods: {
        replaceText(val) {
            return val.replace('%s', '<br/>');
        }
    }
};
</script>


<style lang="scss" scoped>
.about-us {
    padding: 25px 20px 0;

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

        .intro,
        .our-promise,
        .bbin-amusement,
        .ten-reasons {
            p {
                color: #FFF;
                margin: 0;
                font-size: 12px;
                line-height: 22px;
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

                &.title {
                    padding: 0;
                }
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

            .margin-box {
                margin: 18px 0;
            }
        }

        .ten-reasons {
            margin-bottom: 30px;
        }
    }
}
</style>
