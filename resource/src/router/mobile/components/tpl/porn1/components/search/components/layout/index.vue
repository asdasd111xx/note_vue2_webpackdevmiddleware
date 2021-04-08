<template>
  <div>
    <template v-if="source === 'yabo'">
      <component
        v-if="$route.query.key"
        :is="currentLayout.searchInfo"
        :key-word="currentLayout.keyWord"
        :siteId="currentLayout.siteId"
      />
      <component
        v-else
        :is="currentLayout.searchHome"
        :set-key-word="setKeyWord"
        :siteId="currentLayout.siteId"
      />
    </template>

    <template v-else>
      <component
        ref="searchInfo"
        :is="currentLayout.searchInfo"
        :key-word="currentLayout.keyWord"
        :siteId="currentLayout.siteId"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { setCookie } from "@/lib/cookie";

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
    headerConfig: {
      type: Object,
      required: true
    },
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
      case "smallPig":
        setCookie("s_id", "");
        params.isSmallPigSearch = "smallPigSearch";
        this.currentLayout = {
          ...params,
          searchInfo: "smallPigSearchInfo",
          siteId: 2
        };
        break;

      case "gay":
        setCookie("s_id", "7");
        this.currentLayout = {
          ...params,
          searchInfo: "gaySearchInfo",
          siteId: 3
        };
        break;

      case "les":
        setCookie("s_id", "");
        this.currentLayout = {
          ...params,
          searchInfo: "lesSearchInfo",
          siteId: 4
        };
        break;

      case "yabo":
        setCookie("s_id", "9");
        this.currentLayout = {
          searchHome: "yaboSearchHome",
          searchInfo: "yaboSearchInfo",
          siteId: 1,
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
                this.setKeyWord(keyWord);
              }
            }
          }
        };

        this.$emit(
          "update:headerConfig",
          this.$route.query.key
            ? this.currentLayout.headerInfo.info
            : this.currentLayout.headerInfo.home
        );
        break;
    }

    if (this.source !== "yabo") {
      this.$emit("update:headerConfig", this.currentLayout);
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
      if (this.source === "yabo") {
        this.$emit(
          "update:headerConfig",
          this.$route.query.key
            ? this.currentLayout.headerInfo.info
            : this.currentLayout.headerInfo.home
        );

        if (this.$route.query.key) {
          this.currentLayout.headerInfo.info.keyWord = this.$route.query.key;
        }
      }
    }
  }
};
</script>

<style lang="scss" module></style>
