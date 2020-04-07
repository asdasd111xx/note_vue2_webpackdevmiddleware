<template>
    <div :class="$style['copywriting-wrap']">
        <div :class="[$style['copywriting-container'], 'clearfix']">
            <help-menu :class="$style['copywriting-menu']" />
            <component :is="templateName" :class="$style['copywriting-main']" />
        </div>
    </div>
</template>

<script>
export default {
    components: {
        helpMenu: () => import(/* webpackChunkName: 'helpMenu' */'./components/customCopyPage/helpMenu'),
        accountOpen: () => import(/* webpackChunkName: 'accountOpen' */'./components/customCopyPage/accountOpen'),
        deposite: () => import(/* webpackChunkName: 'deposite' */'./components/customCopyPage/deposite'),
        withdarwal: () => import(/* webpackChunkName: 'withdarwal' */'./components/customCopyPage/withdarwal'),
        transfer: () => import(/* webpackChunkName: 'transfer' */'./components/customCopyPage/transfer'),
        preferential: () => import(/* webpackChunkName: 'preferential' */'./components/customCopyPage/preferential'),
        browser: () => import(/* webpackChunkName: 'browser' */'./components/customCopyPage/browser'),
        betting: () => import(/* webpackChunkName: 'betting' */'./components/customCopyPage/betting'),
        hijacking: () => import(/* webpackChunkName: 'hijacking' */'./components/customCopyPage/hijacking'),
        lottery: () => import(/* webpackChunkName: 'lottery' */'./components/customCopyPage/lottery'),
        esports: () => import(/* webpackChunkName: 'esports' */'./components/customCopyPage/esports'),
        sports: () => import(/* webpackChunkName: 'sports' */'./components/customCopyPage/sports'),
        live: () => import(/* webpackChunkName: 'live' */'./components/customCopyPage/live'),
        other: () => import(/* webpackChunkName: 'other' */'./components/customCopyPage/other'),
        responsibility: () => import(/* webpackChunkName: 'responsibility' */'./components/customCopyPage/responsibility'),
        about: () => import(/* webpackChunkName: 'about' */'./components/customCopyPage/about'),
        terms: () => import(/* webpackChunkName: 'terms' */'./components/customCopyPage/terms'),
        // plan: () => import(/* webpackChunkName: 'plan' */'./components/customCopyPage/plan'),
        privacy: () => import(/* webpackChunkName: 'privacy' */'./components/customCopyPage/privacy'),
        contact: () => import(/* webpackChunkName: 'contact' */'./components/customCopyPage/contact'),
        cgPay: () => import(/* webpackChunkName: 'cgPay' */'./components/customCopyPage/cgPay')

    },
    props: {
        templateName: {
            type: String,
            default: () => {}
        }
    }
};
</script>

<style lang="scss" module>
.copywriting-wrap {
    padding-top: 120px;
    background: #FFF;
}

.copywriting-container {
    width: 1200px;
    padding: 30px 0 60px;
    margin: 0 auto;
}

.copywriting-menu {
    float: left;
    width: 306px;
}

.copywriting-main {
    float: left;
    width: 894px;
    min-height: 656px;
    padding: 0 20px;
    background-color: #FFF;
    box-shadow: 0 0 20px hsla(0, 0%, 65.9%,0.3);
}
</style>
