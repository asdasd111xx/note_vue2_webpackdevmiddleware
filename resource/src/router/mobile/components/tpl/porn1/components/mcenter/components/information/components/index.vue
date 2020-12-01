<template>
  <div slot="content" class="content-wrap">
    <div class="information-wrap">
      <div
        v-if="!$route.query.pid"
        :class="[$style['menu-list-wrap'], 'clearfix']"
      >
        <div
          v-for="(item, index) in tabItem"
          :class="$style['menu-list']"
          @click="setCurrentTab(index)"
        >
          <div
            :class="[
              $style['menu-title'],
              { [$style.active]: currentTemplate === item.key },
            ]"
          >
            {{ item.text }}
          </div>

          <div
            v-if="item.hasMsgCount && memInfo.msgCount"
            :class="$style['menu-tips']"
          >
            {{ memInfo.msgCount }}
          </div>
        </div>
        <div
          :class="$style['active-slider']"
          :style="{
            left: `calc(16.5% + 33% * ${currentTab})`,
          }"
        />
      </div>

      <component :is="currentTemplate" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import news from "./news/index";
import post from "./post/index";
import message from "./message/index";

export default {
  components: {
    news,
    post,
    message,
  },
  data() {
    return {
      msgCount: 0,
      currentTab: 0, // 'message', 'news', 'post'
      currentTemplate: "message",
    };
  },
  created() {
    if (["message", "news", "post"].includes(this.$route.params.page)) {
      this.currentTemplate = this.$route.params.page;
      this.currentTab = ["message", "news", "post"].indexOf(
        this.$route.params.page
      );
    }
  },
  methods: {
    ...mapActions([
      // 'actionSetMcenterMsgCount'
    ]),
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.$emit("update:currentTemplate", "message");
          this.currentTemplate = "message";
          break;

        case 1:
          this.$emit("update:currentTemplate", "news");
          this.currentTemplate = "news";
          break;

        case 2:
          this.$emit("update:currentTemplate", "post");
          this.currentTemplate = "post";
          break;
      }
      this.$emit("getCurrentTemplate", this.currentTemplate);
    },
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    headerConfig() {
      const trans = { message: "通知", news: "活动", post: "公告" };
      if (this.themeTPL === "ey1") {
        trans.news == "消息";
      }
      return {
        prev: true,
        title: this.$route.query.pid ? trans[this.currentTemplate] : "消息中心",
        onClick: () => {
          this.$router.back();
        },
      };
    },
    tabItem() {
      if (this.themeTPL === "ey1") {
        return [
          {
            key: "message",
            text: "通知",
            hasMsgCount: true,
          },
          {
            key: "news",
            text: "消息",
          },
          {
            key: "post",
            text: "公告",
          },
        ];
      } else {
        return [
          {
            key: "message",
            text: "通知",
            hasMsgCount: true,
          },
          {
            key: "news",
            text: "活动",
          },
          {
            key: "post",
            text: "公告",
          },
        ];
      }
    },
  },
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.index.scss" module="$style_ey1"></style>
