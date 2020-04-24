<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" :class="$style['content-wrap']">
            <video-tab :sort-id.sync="sortId" :is-single.sync="isSingle" />
            <video-list :sort-id="sortId" :is-single="isSingle" />
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import videoTab from './components/new/videoTab';
import videoList from './components/new/videoList';
import mobileContainer from '../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        videoTab,
        videoList
    },
    data() {
        return {
            active: +this.$route.query.sortId,
            isOne: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        headerConfig() {
            return {
                prev: true,
                isBackgroundGradient: true,
                title: this.$text('S_FULL_HD_MOVIE', '全部高清影片'),
                hasSearchBtn: true,
                onClick: () => { this.$router.back(); }
            };
        },
        sortId: {
            get() {
                return this.active;
            },
            set(value) {
                this.active = value;
            }
        },
        isSingle: {
            get() {
                return this.isOne;
            },
            set() {
                this.isOne = !this.isOne;
            }
        }
    },
    created() {
        if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
            this.$router.push('/mobile');
        }
    }
};
</script>

<style lang="scss" module>
.content-wrap {
    background: #eee;
}
</style>
