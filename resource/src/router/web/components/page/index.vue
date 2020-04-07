<template>
    <div class="main-wrap">
        <join-member v-if="nowpage == 'join'" :has-agreement="['129', '30', '32', '177'].includes(webInfo.alias)">
            <template v-if="['129', '30', '32', '177'].includes(webInfo.alias)">
                <title-brilliant slot="join-header" />
                <game-nav-brilliant slot="top-content" :style="{display: 'block', float: 'left'}" />
                <bottom-brilliant slot="bottom-content" />
            </template>
        </join-member>
        <join-agent v-else-if="nowpage == 'joinAgent'" />
        <pwd-reset v-else-if="nowpage == 'pwdreset'" />
        <agreement v-else-if="nowpage == 'agreement'" />
        <mcenter v-else-if="nowpage == 'mcenter'" />
        <ele-content v-else :sort-array="sortArray" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

// 這裡將本站優惠留著
// 待後續本站優惠裡面的我的優惠搬移到會員中心後
// 再直接把檔案與此段註解刪除
// import promotion from './promotion';

export default {
    components: {
        mcenter: () => import(/* webpackChunkName: 'mcenter' */'@/components/mcenter'),
        eleContent: () => import(/* webpackChunkName: 'eleContent' */'../element'),
        joinMember: () => import(/* webpackChunkName: 'joinMember' */'./join_member'),
        joinAgent: () => import(/* webpackChunkName: 'joinAgent' */'./join_agent'),
        pwdReset: () => import(/* webpackChunkName: 'pwdReset' */'./pwd_reset'),
        agreement: () => import(/* webpackChunkName: 'agreement' */'./agreement'),
        titleBrilliant: () => import(/* webpackChunkName: 'titleBrilliant' */'./join_member/titleBrilliant'),
        bottomBrilliant: () => import(/* webpackChunkName: 'bottomBrilliant' */'./join_member/bottomBrilliant'),
        gameNavBrilliant: () => import(/* webpackChunkName: 'gameNavBrilliant' */'../tpl/8/brilliant/components/gameNav.vue')
    },
    computed: {
        ...mapGetters({
            nowpage: 'getNowpage',
            webInfo: 'getWebInfo',
            pageData: 'getPageData'
        }),
        sortArray() {
            const { pageData } = this;
            const tempData = [];

            // 預設首頁
            let pageId = Object.keys(pageData)[0];

            Object.keys(pageData).some((ID) => {
                if (+ID === this.nowpage || pageData[ID].page_key === this.nowpage) {
                    pageId = ID;
                    return true;
                }

                return false;
            });

            if (!pageData[pageId] || !pageData[pageId].data) {
                return tempData;
            }

            pageData[pageId].data.forEach((data, index) => {
                pageData[pageId].case.forEach((caseData) => {
                    const content = [];

                    if (caseData.cid !== data.i) {
                        return;
                    }

                    caseData.data.forEach((item) => {
                        if (!item.content) {
                            return;
                        }

                        content.push(item.content);
                    });

                    tempData.push({ ...pageData[pageId].data[index], case: { ...caseData, content } });
                });
            });

            return tempData;
        }
    }
};
</script>
