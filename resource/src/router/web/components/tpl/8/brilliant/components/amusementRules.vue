<template>
    <div class="amusement-rule-wrap">
        <sidebar />
        <div class="content">
            <div class="nav-bar">
                <div class="amusement-rule active">
                    {{ i18nList.amusementRule[language] }}
                </div>
                <div class="agreement" @click="changePage({ type: 'custom', page: 'agreement' })">
                    {{ i18nList.agreement[language] }}
                </div>
                <div class="open-account" @click="changePage({ type: 'custom', page: 'open-account' })">
                    {{ i18nList.openAccount[language] }}
                </div>
            </div>
            <ul class="intro">
                <li v-for="item in 13" :key="`amusementRule${item}`">
                    {{ i18nList[`amusementRule${item}`][language] }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
        ...mapGetters({
            curLang: 'getCurLang',
            webInfo: 'getWebInfo'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage({ page, type }) {
            const pageList = {
                'open-account': {
                    30: 6049,
                    32: 6057,
                    177: 17731
                },
                agreement: {
                    30: 6051,
                    32: 6059,
                    177: 17733
                }
            };

            this.actionChangePage({ type, page: pageList[page][this.webInfo.alias] });
        }
    }
};
</script>


<style lang="scss" scoped>
.amusement-rule-wrap {
    padding: 20px 20px 0;

    .content {
        display: inline-block;
        vertical-align: top;
        margin: 18px 0 0 25px;
        width: 637px;

        .nav-bar {
            height: 34px;
            padding-left: 2px;

            .amusement-rule,
            .agreement,
            .open-account {
                background-color: #3C292B;
                color: #FFF;
                float: left;
                padding: 6px 16px;
                font-size: 12px;
                margin-right: 5px;
                border-radius: 5px 5px 0 0;
                line-height: 22px;
                cursor: pointer;

                &.active {
                    background-color: #C47D01;
                }
            }
        }

        .intro {
            width: 625px;
            margin: 18px 0;
            padding-left: 25px;

            li {
                color: #FFF;
                margin: 0;
                font-size: 12px;
                line-height: 22px;
            }
        }
    }
}
</style>
