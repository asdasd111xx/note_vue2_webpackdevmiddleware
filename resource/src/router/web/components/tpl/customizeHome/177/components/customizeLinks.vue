<template>
    <div class="customize-links-wrap">
        <div
            v-for="(linksInfo, index) in linksData"
            :key="`links-${index}`"
            class="customize-links"
            @click="changePage(linksInfo)"
        >
            <button :style="`color: ${linksInfo.color}`">{{ linksInfo.title[language] }}</button>
            <span v-if="linksData.length - 1 !== index">|</span>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import i18nList from '../config/lang';

export default {
    data() {
        return {
            linksData: [
                {
                    title: i18nList.customizeLink01,
                    color: '#FF379D',
                    pageType: {
                        page: '',
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.customizeLink02,
                    color: '#FFDE00',
                    pageType: {
                        page: 'mcenter',
                        type: ''
                    },
                    mcenterPage: 'bankRebate'
                },
                {
                    title: i18nList.customizeLink03,
                    color: '#00FF24',
                    pageType: {
                        page: 17715,
                        type: 'custom'
                    }
                },
                {
                    title: i18nList.customizeLink04,
                    color: '#DFDAD1',
                    pageType: {
                        page: 'bbcasino',
                        type: 'games',
                        config: {
                            linkItem: '5902'
                        }
                    }
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            loginStatus: 'getLoginStatus',
            curLang: 'getCurLang'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    created() {
        this.linksData[0].pageType.page = this.webInfo.page[0].pid;
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage(pageInfo) {
            if (this.isBackEnd) {
                return;
            }

            if (pageInfo.pageType.page === 'mcenter') {
                if (!this.loginStatus) {
                    alert(this.$i18n.t('S_LOGIN_TIPS'));
                    return;
                }
                this.actionChangePage({ page: 'mcenter', type: '', subPage: pageInfo.mcenterPage });
                return;
            }
            this.actionChangePage(pageInfo.pageType);
        }
    }
};
</script>

<style lang="scss" src="../css/customizeLinks.scss" scoped />
