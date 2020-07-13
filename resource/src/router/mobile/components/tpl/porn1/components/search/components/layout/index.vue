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
        :is="currentLayout.searchInfo"
        :key-word="currentLayout.keyWord"
        :siteId="currentLayout.siteId"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

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
      keyWord: "",
      headerInfo: {
        prev: true,
        hasSearchBar: true,
        keyWord: "",
        onClick: () => {
          this.$router.back();
        },
        onSearchClick: keyWord => {
          this.setKeyWord(keyWord);
        }
      }
    };

    switch (this.source) {
      case "smallPig":
        params.headerInfo.isSmallPigSearch = "smallPigSearch"
        this.currentLayout = {
          ...params,
          searchInfo: "smallPigSearchInfo",
          siteId: 2,
        };
        break;

      case "gay":
        this.currentLayout = {
          ...params,
          searchInfo: "gaySearchInfo",
          siteId: 3
        };
        break;

      case "les":
        this.currentLayout = {
          ...params,
          searchInfo: "lesSearchInfo",
          siteId: 4
        };
        break;

      case "yabo":
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
      this.$emit("update:headerConfig", this.currentLayout.headerInfo);
    }
  },
  methods: {
    setKeyWord(keyWord) {
      if (!keyWord) {
        return;
      }

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
