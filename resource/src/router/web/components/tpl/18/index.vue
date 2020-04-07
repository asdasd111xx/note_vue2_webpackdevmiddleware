<template>
    <div id="main-body" :class="['main-container', `tpl-${webInfo.model}`, nowpage.toString(), 'theme-miller']">
        <components :is="`pageHeader${webInfo.alias}`" @openLoginModal="loginModalStatus = isBackEnd ? false : true" />
        <page-body v-if="isCustomPage && templateName !== 'page'" :template-name="templateName" />
        <template v-else>
            <img
                v-if="nowpage === 'promotion'"
                :src="$getCdnPath('/static/image/tpl/16/ledong_promotion.jpg')"
                class="promotion"
            />
            <page />
        </template>
        <login v-if="loginModalStatus" @closeModal="loginModalStatus = false" />
        <components :is="`pageFooter${webInfo.alias}`" />
        <service />
        <!-- 代理中心及會員中心彈窗 -->
        <div v-if="popType === 'note' && nowpage !== 'mcenter'" class="note-content">
            <note :position="popData" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import pageBody from './body';
import page from '../../page';
import pageHeader500011 from '../customizeHome/500011/components/header';
import pageHeader52 from '../customizeHome/52/components/header';
import pageHeader53 from '../customizeHome/53/components/header';
import pageFooter500011 from '../customizeHome/500011/components/footer';
import pageFooter52 from '../customizeHome/52/components/footer';
import pageFooter53 from '../customizeHome/53/components/footer';
import login from '../customizeHome/500011/components/login';
import service from '../customizeHome/500011/components/service';
import note from '../../../../../components/mcenter/components/common/note';

export default {
    components: {
        pageHeader500011,
        pageHeader52,
        pageHeader53,
        pageBody,
        page,
        login,
        service,
        pageFooter500011,
        pageFooter52,
        pageFooter53,
        note
    },
    data() {
        return {
            pageList: {
                500011: {
                    36319: 'aboutUs',
                    36323: 'trust',
                    36324: 'terms',
                    36325: 'agreement',
                    36326: 'privacy',
                    36327: 'cgpay',
                    36330: 'browser',
                    36328: 'problem',
                    36322: 'contact',
                    34298: 'promotion',
                    36299: 'sportBet'
                },
                53: {
                    12171: 'aboutUs',
                    12175: 'trust',
                    12176: 'terms',
                    12177: 'agreement',
                    12178: 'privacy',
                    12179: 'cgpay',
                    12180: 'problem',
                    12174: 'contact',
                    10733: 'promotion',
                    12170: 'sportBet'
                },
                52: {
                    12158: 'aboutUs',
                    12162: 'trust',
                    12163: 'terms',
                    12164: 'agreement',
                    12165: 'privacy',
                    12166: 'cgpay',
                    12167: 'problem',
                    12161: 'contact',
                    10684: 'promotion',
                    12157: 'sportBet'
                }
            },
            loginModalStatus: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            nowpage: 'getNowpage',
            popData: 'getPopData',
            popType: 'getPopType'
        }),
        isCustomPage() {
            if (this.nowpage === 'mcenter' || this.nowpage === 'promotion') {
                return false;
            }

            if (Object.keys(this.pageList[this.webInfo.alias]).includes(this.nowpage.toString())) {
                return true;
            }

            return Number.isNaN(+this.nowpage);
        },
        templateName() {
            return this.pageList[this.webInfo.alias][this.$route.params.pid] || 'page';
        }
    },
    watch: {
        loginModalStatus() {
            document.body.style.overflow = this.loginModalStatus ? 'hidden' : '';
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" />
