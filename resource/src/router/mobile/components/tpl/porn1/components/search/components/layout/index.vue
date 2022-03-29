<template>
  <div>
    <template v-if="['yv', 'av', 'free-yv'].includes(source)">
      <component
        v-if="$route.query.key"
        :is="currentLayout.searchInfo"
        :key-word="currentLayout.keyWord"
      />
      <component
        v-else
        :is="currentLayout.searchHome"
        :set-key-word="setKeyWord"
      />
    </template>

    <template v-else>
      <component
        ref="searchInfo"
        :is="currentLayout.searchInfo"
        :key-word="currentLayout.keyWord"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { setCookie } from "@/lib/cookie";
import join from "lodash/join";
import split from "lodash/split";

export default {
  components: {
    //  Yabo 版面
    yaboSearchHome: () => import("../layout/yabo/searchHome"),
    yaboSearchInfo: () => import("../layout/yabo/searchInfo"),
    //  Custom 版面
    smallPigSearchInfo: () => import("../layout/custom/searchInfo"),
    gaySearchInfo: () => import("../layout/custom/searchInfo"),
    lesSearchInfo: () => import("../layout/custom/searchInfo")
  },
  props: {
    source: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentLayout: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  created() {
    const params = {
      prev: true,
      hasSearchBar: true,
      keyWord: "",
      onClick: () => {
        this.$router.back();
        localStorage.removeItem("v-search-word");
      },
      onSearchClick: keyWord => {
        if (!keyWord) {
          return;
        }

        this.setKeyWord(keyWord);
        localStorage.setItem("v-search-word", keyWord);

        // 呼叫搜索頁面底下的 Function 呼叫搜尋 Api
        this.$refs.searchInfo.setSearchList();
      }
    };

    switch (this.source) {
      case "free-yv":
      case "yv":
        setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["YV"]);
        break;
      case "av":
        setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["AV"]);
        break;

      default:
        setCookie(
          "s_id",
          this.siteConfig.PORN_CONFIG.ID[this.source.toUpperCase()]
        );
        break;
    }

    switch (this.source) {
      case "sp":
        params.isSmallPigSearch = "smallPigSearch";
        this.currentLayout = {
          ...params,
          searchInfo: "smallPigSearchInfo"
        };
        break;

      case "gay":
        this.currentLayout = {
          ...params,
          searchInfo: "gaySearchInfo"
        };
        break;

      case "les":
        this.currentLayout = {
          ...params,
          searchInfo: "lesSearchInfo"
        };
        break;

      case "free-yv":
      case "yv":
      case "av":
        this.currentLayout = {
          searchHome: "yaboSearchHome",
          searchInfo: "yaboSearchInfo",
          keyWord: this.$route.query.key,
          headerInfo: {
            home: {
              prev: true,
              title: this.$text("S_SEARCH", "搜索视频"),
              onClick: () => {
                this.$router.back();
              }
            },
            info: {
              prev: true,
              hasSearchBar: true,
              keyWord: this.$route.query.key,
              onClick: () => {
                this.$router.back();
              },
              onSearchClick: keyWord => {
                const historyList = localStorage.getItem("history-search")
                  ? split(localStorage.getItem("history-search"), ",")
                  : [];
                const historyKeyWord = historyList.includes(keyWord)
                  ? [...historyList]
                  : [...historyList, keyWord];

                localStorage.setItem("history-search", join(historyKeyWord));

                this.setKeyWord(keyWord);
              }
            }
          }
        };

        this.$emit(
          "setHeader",
          this.$route.query.key
            ? this.currentLayout.headerInfo.info
            : this.currentLayout.headerInfo.home
        );
        break;
    }

    if (!["yv", "free-yv", "av"].includes(this.source)) {
      this.$emit("setHeader", this.currentLayout);
    }

    // Local 有文字預先做搜索
    if (localStorage.getItem("v-search-word")) {
      const keyWord = localStorage.getItem("v-search-word");
      this.setKeyWord(keyWord);
      localStorage.removeItem("v-search-word");
    }
  },
  methods: {
    setKeyWord(keyWord) {
      this.currentLayout.keyWord = keyWord;
    }
  },
  watch: {
    "$route.query"() {
      this.$emit(
        "setHeader",
        this.$route.query.key
          ? this.currentLayout.headerInfo.info
          : this.currentLayout.headerInfo.home
      );

      if (this.$route.query.key) {
        this.currentLayout.headerInfo.info.keyWord = this.$route.query.key;
      }
    }
  }
};
</script>

<style lang="scss" module></style>
