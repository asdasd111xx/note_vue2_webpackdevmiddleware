<template>
    <div class="open-account-wrap">
        <sidebar />
        <div class="content">
            <div class="nav-bar">
                <div class="amusement-rule" @click="changePage({ type: 'custom', page: 'amusement-rule' })">
                    {{ i18nList.amusementRule[language] }}
                </div>
                <div class="agreement" @click="changePage({ type: 'custom', page: 'agreement' })">
                    {{ i18nList.agreement[language] }}
                </div>
                <div class="open-account active">
                    {{ i18nList.openAccount[language] }}
                </div>
            </div>
            <account-Text />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import sidebar from './gameNav';
import i18nList from '../config/lang';
import accountText from './openAccountText';

export default {
    components: {
        sidebar,
        accountText
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
.open-account-wrap {
    padding: 20px 20px 0;

    .content {
        display: inline-block;
        vertical-align: top;
        margin: 18px 0 0 25px;
        width: 700px;

        .nav-bar {
            height: 44px;
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
    }
}
</style>
