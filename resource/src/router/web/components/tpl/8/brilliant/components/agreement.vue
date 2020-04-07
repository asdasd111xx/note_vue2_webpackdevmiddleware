<template>
    <div class="agreement-wrap">
        <sidebar />
        <div class="content">
            <div class="nav-bar">
                <div class="amusement-rule" @click="changePage({ type: 'custom', page: 'amusement-rule' })">
                    {{ i18nList.amusementRule[language] }}
                </div>
                <div class="agreement active">
                    {{ i18nList.agreement[language] }}
                </div>
                <div class="open-account" @click="changePage({ type: 'custom', page: 'open-account' })">
                    {{ i18nList.openAccount[language] }}
                </div>
            </div>
            <ol class="intro">
                <li v-for="item in 28" :key="`agreement${item}`">
                    <span>{{ i18nList[`agreement${item}`][language] }}</span>
                    <div v-if="item === 9 || item === 16" class="example">
                        <p>{{ i18nList[`agreement${item}a`][language] }}</p>
                        <p>{{ i18nList[`agreement${item}b`][language] }}</p>
                    </div>
                </li>
            </ol>
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
                'amusement-rule': {
                    30: 6050,
                    32: 6058,
                    177: 17732
                },
                'open-account': {
                    30: 6049,
                    32: 6057,
                    177: 17731
                }
            };

            this.actionChangePage({ type, page: pageList[page][this.webInfo.alias] });
        }
    }
};
</script>


<style lang="scss" scoped>
.agreement-wrap {
    padding: 20px 20px 0;

    .content {
        display: inline-block;
        vertical-align: top;
        margin: 18px 0 0 25px;
        width: 700px;

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
            margin: 18px 0;
            width: 625px;
            padding-left: 25px;

            li {
                color: #FFF;
                font-size: 12px;
                line-height: 22px;

                .example {
                    p {
                        margin: 0;
                        line-height: 22px;
                    }
                }
            }
        }
    }
}
</style>
