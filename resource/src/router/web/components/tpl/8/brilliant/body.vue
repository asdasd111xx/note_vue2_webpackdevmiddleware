<template>
    <div class="brilliant">
        <static-page-container v-if="isCustomPage">
            <components :is="templateName" />
        </static-page-container>
        <page v-else />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import page from '../../../page';
import staticPageContainer from './components/staticPageContainer';

export default {
    components: {
        page,
        staticPageContainer,
        aboutUs: () => import(/* webpackChunkName: 'aboutUs' */'./components/aboutUs'),
        depositHelp: () => import(/* webpackChunkName: 'depositHelp' */'./components/depositHelp'),
        withdrawHelp: () => import(/* webpackChunkName: 'withdrawHelp' */'./components/withdrawHelp'),
        commonQuestion: () => import(/* webpackChunkName: 'commonQuestion' */'./components/commonQuestion'),
        agreement: () => import(/* webpackChunkName: 'agreement' */'./components/agreement'),
        contactUs: () => import(/* webpackChunkName: 'contactUs' */'./components/aboutUs'),
        amusementRules: () => import(/* webpackChunkName: 'amusementRules' */'./components/amusementRules'),
        openAccount: () => import(/* webpackChunkName: 'openAccount' */'./components/openAccount')
    },
    data() {
        return {
            customPageList: {
                30: {
                    6044: 'about-us',
                    6045: 'deposit-help',
                    6046: 'withdraw-help',
                    6047: 'common-question',
                    6048: 'contact-us',
                    6049: 'open-account',
                    6050: 'amusement-rules',
                    6051: 'agreement'
                },
                32: {
                    6052: 'about-us',
                    6053: 'deposit-help',
                    6054: 'withdraw-help',
                    6055: 'common-question',
                    6056: 'contact-us',
                    6057: 'open-account',
                    6058: 'amusement-rules',
                    6059: 'agreement'
                },
                177: {
                    17726: 'about-us',
                    17727: 'deposit-help',
                    17728: 'withdraw-help',
                    17729: 'common-question',
                    17730: 'contact-us',
                    17731: 'open-account',
                    17732: 'amusement-rules',
                    17733: 'agreement'
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            nowpage: 'getNowpage'
        }),
        isCustomPage() {
            if (this.nowpage === 'mcenter' || this.nowpage === 'promotion') {
                return false;
            }

            if (Object.keys(this.customPageList[this.webInfo.alias]).includes(this.nowpage.toString())) {
                return true;
            }

            return Number.isNaN(+this.nowpage);
        },
        templateName() {
            return this.customPageList[this.webInfo.alias][this.nowpage] || 'page';
        }
    }
};
</script>
