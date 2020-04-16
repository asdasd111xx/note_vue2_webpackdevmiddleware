<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" class="content-wrap">
            <search-info v-if="$route.params.key" :key-word="keyWord" />
            <search-home v-else :set-key-word="setKeyWord" />
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import searchHome from './components/searchHome';
import searchInfo from './components/searchInfo';
import mobileContainer from '../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        searchHome,
        searchInfo
    },
    data() {
        return {
            keyWord: this.$route.params.key
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        headerConfig() {
            if (this.$route.params.key) {
                return {
                    prev: true,
                    hasSearchBar: true,
                    isBackgroundGradient: true,
                    keyWord: this.$route.params.key,
                    onClick: () => { this.$router.back(); },
                    onSearchClick: (keyWord) => { this.setKeyWord(keyWord); }
                };
            }

            return {
                prev: true,
                isBackgroundGradient: true,
                title: this.$text('S_SEARCH', '搜寻'),
                onClick: () => { this.$router.back(); }
            };
        }
    },
    created() {
        if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
            this.$router.push('/mobile');
        }
    },
    methods: {
        setKeyWord(keyWord) {
            if (!keyWord) {
                return;
            }

            this.keyWord = keyWord;
        }
    }
};
</script>
