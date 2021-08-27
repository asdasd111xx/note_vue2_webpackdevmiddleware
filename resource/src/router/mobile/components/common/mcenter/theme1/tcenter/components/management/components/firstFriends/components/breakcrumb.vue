<template>
  <div
    :class="[
      $style['breakcrumb'],
      { [$style['team-manage']]: !searchResult },
      { [$style['team-manage-search']]: searchResult }
    ]"
    id="breakcrumb_id"
  >
    <span
      v-for="(friend, index) in list"
      :key="friend.id"
      :class="{
        [$style['current']]: lastIndex === index
      }"
      @click="clickTarget(friend.alias, friend.id, index)"
    >
      {{ friend.alias }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    depth: {
      type: Number,
      default: 1
    },
    list: {
      type: Array,
      default: []
    },
    // searchResult:true =>自訂日期＋好友名稱搜尋  searchResult:false =>自訂日期搜尋
    searchResult: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      path: this.$route.params.item
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    lastIndex() {
      return this.list.length - 1;
    }
  },
  updated() {
    let dom = document.getElementById("breakcrumb_id");

    if (!dom) return;
    dom.scrollLeft = this.depth * 25;
  },
  methods: {
    clickTarget(alias, id, index) {
      //搜尋結果的帳號不能點擊
      if (this.searchResult) {
        return;
      }
      // 有需要此需求再開啟
      this.$emit("send-name", { alias: alias, id: id, index: index });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.breakcrumb {
  display: flex;
  align-items: center;
  height: 40px;
  color: #a2a2a2;
  background: #fefffe;
  padding: 0 18px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: auto;
  position: relative;
  bottom: 7px;
  &.team-manage-search {
    color: #a2a2a2;

    &.team-manage-search span.current {
      color: #414655;
    }
  }

  &.team-manage {
    color: #2693fc;

    &.team-manage span.current {
      color: #414655;
    }
  }

  span.current {
    color: #2693fc;
  }

  span:not(:last-child)::after {
    content: ">";
    color: #5e626d;
    padding: 0 5px;
  }
}
</style>
