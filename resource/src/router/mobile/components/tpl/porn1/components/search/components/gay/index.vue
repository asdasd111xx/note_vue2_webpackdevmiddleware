<template>
  <div>
    <search-info :key-word="keyWord" :siteId="siteId" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import searchInfo from "../layout/custom/searchInfo";

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
      siteId: 3,
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
