<template>
    <div class="header-wrap">
        <div class="header">
            <!-- logo -->
            <ele-logo :logo-width="306" :logo-height="95" />
            <div class="header-top-wrap clearfix">
                <!-- 自訂連結 -->
                <customize-links />
                <!-- 語系 -->
                <ele-lang :theme="3" />
                <a href="###" class="spare-url">{{ i18nList.spareUrl[language] }}</a>
            </div>
            <div class="header-feature-wrap clearfix">
                <!-- 導覽列 -->
                <ele-nav
                    :nav-max="11"
                    icon-type="plus"
                />
                <!-- 會員登入＆會員資訊 -->
                <div :class="['header-login-wrap', loginStatus ? 'is-login' : '']">
                    <template v-if="!loginStatus">
                        <ele-login-form />
                    </template>
                    <ele-login-info v-else />
                </div>
                <!-- 最新消息 -->
                <div class="news-wrap">
                    <ele-news :speed="800" direction="up" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import i18nList from '../config/lang';
import eleLogo from '../../../../common/logo';
import eleNews from '../../../../common/news';
import eleNav from './nav';
import eleLang from './lang';
import customizeLinks from './customizeLinks';

export default {
    components: {
        eleLogo,
        eleNews,
        eleNav,
        eleLang,
        customizeLinks,
        eleLoginInfo: () => import(/* webpackChunkName: 'eleLoginInfo' */'./loginInfo'),
        eleLoginForm: () => import(/* webpackChunkName: 'eleLoginForm' */'./loginForm')
    },
    data() {
        return {
            i18nList
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            curLang: 'getCurLang'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    mounted() {
        // 前台才動作
        if (!this.isBackEnd) {
            this.$on('setPop', this.setPop);
            this.$on('changePage', this.changePage);
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        setPop(data) {
            this.actionSetPop(data);
        },
        changePage(data) {
            this.actionChangePage(data);
        }
    }
};
</script>

<style lang="scss" src="../css/header.scss" scoped />
