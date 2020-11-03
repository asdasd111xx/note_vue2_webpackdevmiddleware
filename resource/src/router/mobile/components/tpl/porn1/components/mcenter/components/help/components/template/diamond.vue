<template>
  <div slot="content" :class="$style['help-wrap']">
    <div
      v-for="listInfo in list"
      :key="`list-${listInfo.name}`"
      :class="$style.list"
      @click="handleClick(listInfo)"
    >
      <span> {{ listInfo.name }} </span>
      <div :class="$style['btn-next']">
        <img :src="$getCdnPath(`/static/image/_new/common/arrow_next.png`)" />
      </div>
    </div>
  </div>
</template>

<script>
import member from "@/api/member";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      list: [
        {
          name: "SWAG钻石购买说明",
          key: "buymethod",
        },
        {
          name: "SWAG钻石使用方法",
          key: "usage",
        },


      ]
    };
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: "帮助中心"
      };
    },
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      return isApp;
    },
  },
  created() { },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    handleClick(item) {

      this.$router.push(`/mobile/mcenter/help/detail?type=${item.key}${this.isApp ? "&app=true" : ""}`);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.help-wrap {
  color: $main_text_color3;
  position: relative;

  .list {
    height: 60px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    background-color: $main_white_color1;
  }

  .btn-next {
    width: 14px;
    height: 100%;
    margin-left: auto;
    display: flex;
    align-items: center;
    > img {
      height: 14px;
      width: 14px;
    }
  }
}
</style>
