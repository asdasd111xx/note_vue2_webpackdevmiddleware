<template>
  <div>
    <search-info v-if="$route.query.key" :key-word="keyWord" :siteId="siteId" />
    <search-home v-else :set-key-word="setKeyWord" :siteId="siteId" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import searchHome from "../layout/yabo/searchHome";
import searchInfo from "../layout/yabo/searchInfo";

/********************************
 * Source 為 Yabo 最外層的接口元件 *
 ********************************/

export default {
  components: {
    searchHome,
    searchInfo
  },
  props: {
    headerConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
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
  },
  created() {
    this.$emit(
      "update:headerConfig",
      this.$route.query.key ? this.headerInfo.info : this.headerInfo.home
    );
  },
  methods: {
    setKeyWord(keyWord) {
      if (!keyWord) {
        return;
      }

      this.keyWord = keyWord;
    }
  },
  watch: {
    "$route.query"() {
      this.$emit(
        "update:headerConfig",
        this.$route.query.key ? this.headerInfo.info : this.headerInfo.home
      );
    }
  }
};
</script>

<style lang="scss" module></style>
