<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content" :class="[$style['content-wrap']]">
            <div :class="[$style['search-hot']]">
                <span>姿势</span>
                <span>美臀</span>
                <span>调教/奴隶</span>
                <span>女店员</span>
                <span>烂醉如泥</span>
            </div>
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

.search-hot {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 42px;
    background: #fefffe;
    color: #bf8646;
    font-weight: 400;
    font-size: 12px;

    span {
        position: relative;
        padding: 0px 5px;

        + span::before {
            content: "";
            position: absolute;
            width: 3px;
            height: 3px;
            top: 50%;
            left: -2.5px;
            border-radius: 50%;
            background: #bf8646;
            transform: translate(0%, -50%);
        }
    }
}
</style>
