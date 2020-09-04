<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" class="agcenter-home">
            <div class="news-wrap clearfix">
                <div class="news-title">NEWS</div>
                <eleNews class="news" data-source="agent" />
            </div>
            <top-info />
            <top-link />
            <ag-list />
            <popNews />
        </div>
    </mobile-container>
</template>

<script>
import { mapActions } from 'vuex';
import agent from '@/api/agent';
import eleNews from '@/router/web/components/common/news';
import mobileContainer from '../../../../common/mobileContainer';
import topInfo from './topInfo';
import topLink from './topLink';
import agList from './agList';

export default {
    components: {
        mobileContainer,
        eleNews,
        topInfo,
        topLink,
        agList,
        popNews: () => import(/* webpackChunkName: 'popNews' */'@/router/web/components/common/popNews')
    },
    data() {
        return {
            headerConfig: {
                prev: true,
                onClick: () => { this.goPrev(); },
                title: this.$text('S_AGENT', '代理中心')
            }
        };
    },
    methods: {
        ...mapActions([
            'actionSetAgentLogin'
        ]),
        goPrev() {
            agent.logout({
                success: () => {
                    this.actionSetAgentLogin(false);
                    this.$router.push('/mobile/agLogin');
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.agcenter-home {
    background-color: #FFF;
    height: 100%;

    .news-wrap {
        position: relative;
        overflow: hidden;
        height: 21px;
        line-height: 21px;
        padding: 0 6px 0 69px;
        background-color: #333333;
        color: #FFF;

        .news-title {
            position: absolute;
            top: 0;
            left: 9px;
        }

        .news {
            height: 21px;
            line-height: 21px;
        }
    }
}
</style>
