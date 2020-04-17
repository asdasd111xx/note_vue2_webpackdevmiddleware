<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" :class="[$style['content-wrap']]">
            <search-info v-if="$route.params.key" :key-word="keyWord" />
            <search-home v-else :set-key-word="setKeyWord" />
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import searchHome from "./components/new/searchHome";
import searchInfo from "./components/new/searchInfo";
import mobileContainer from "../common/new/mobileContainer";

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
            memInfo: "getMemInfo"
        }),
        headerConfig() {
            if (this.$route.params.key) {
                return {
                    prev: true,
                    hasSearchBar: true,
                    isBackgroundGradient: true,
                    keyWord: this.$route.params.key,
                    onClick: () => {
                        this.$router.back();
                    },
                    onSearchClick: keyWord => {
                        this.setKeyWord(keyWord);
                    }
                };
            }

            return {
                prev: true,
                isBackgroundGradient: true,
                title: this.$text("S_SEARCH", "搜索视频"),
                onClick: () => {
                    this.$router.back();
                }
            };
        }
    },
    created() {
        if (
            !this.memInfo.config.content_rating ||
            !this.memInfo.user.content_rating
        ) {
            this.$router.push("/mobile");
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

<style lang="scss" module>
.content-wrap {
    background: #f8f8f7;
}

</style>
