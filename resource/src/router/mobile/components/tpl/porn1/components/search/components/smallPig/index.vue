<template>
  <div>
    <search-info :key-word="keyWord" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import searchInfo from "./components/searchInfo";

/************************************
 * Source 為 smallPig 最外層的接口元件 *
 ************************************/

export default {
  components: {
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
      keyWord: "",
      headerInfo: {
        prev: true,
        hasSearchBar: true,
        isBackgroundGradient: true,
        keyWord: "",
        source: 'smallPig',
        onClick: () => {
          this.$router.back();
        },
        onSearchClick: keyWord => {
          this.setKeyWord(keyWord);
        }
      }
    };
  },
  created() {
    this.$emit("update:headerConfig", this.headerInfo);
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

<style lang="scss" module></style>
