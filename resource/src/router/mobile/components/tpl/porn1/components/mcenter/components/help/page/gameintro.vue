<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content">
      <div :class="$style['section']">
        <div
          :class="[$style['cell']]"
          :style="{ 'margin-bottom': '10px' }"
          @click="isShowPop = true"
        >
          <div :class="$style['title']">
            {{ categorys[currentIndex] }}
          </div>
          <div :class="[$style['arrow-btn']]">
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </div>

        <div
          v-for="(item, index) in lists[currentIndex]"
          :id="`q-${index}`"
          :class="[$style['cell'], $style['flex']]"
          :key="item.key"
          @click="clickGotoDetail(item)"
        >
          <template v-if="item.title && item.content">
            <div :class="$style['title-icon']">
              <img
                :src="$getCdnPath('/static/image/_new/mcenter/ic_help.png')"
                alt="help"
              />
            </div>
            <div :class="$style['title']">
              {{ item.title }}
            </div>
          </template>
        </div>
      </div>

      <div v-if="isShowPop" :class="$style['pop-wrap']">
        <div :class="$style['pop-mask']" @click="isShowPop = false" />
        <div :class="$style['pop-menu']">
          <div :class="$style['pop-title']">
            <span @click="isShowPop = false">{{
              $text("S_CANCEL", "取消")
            }}</span>
            选择游戏类别
          </div>
          <ul :class="$style['pop-list']">
            <li
              v-for="(item, index) in categorys"
              :key="index"
              @click="setType(index)"
            >
              {{ item }}
              <icon
                v-if="currentIndex === index"
                :class="$style['select-icon']"
                name="check"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../../../common/new/mobileContainer";
import info from "../json/gameintro.json";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      currentIndex: 0,
      isShowPop: false
    };
  },
  mounted() {
    if (!info) this.$router.back();

    this.$nextTick(() => {
      // 在幫助中心有清除該local，故新增預設為0
      this.currentIndex = Number(localStorage.getItem("help_gameIntro")) || 0;
    });
  },
  computed: {
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      if (isApp) document.title = "游戏介绍";

      return isApp;
    },
    headerConfig() {
      if (!this.isApp)
        return {
          prev: true,
          onClick: () => {
            this.$router.back();
          },
          title: this.$text("S_GAME_INTR", "游戏介绍")
        };
    },
    categorys() {
      return info.data.map(item => {
        return item.category;
      });
    },
    kind() {
      return info.data.map(item => {
        return item.kind;
      });
    },
    lists() {
      return info.data.map(item => {
        return item.list;
      });
    }
  },
  methods: {
    setType(index) {
      this.currentIndex = index;
      this.isShowPop = false;
    },
    clickGotoDetail(item) {
      localStorage.setItem("help_gameIntro", this.currentIndex);

      this.$router.push(
        `/mobile/mcenter/help/detail?index=${this.currentIndex}&key=${
          item.key
        }&type=gameintro${this.isApp ? "&app=true" : ""}`
      );
    }
  }
};
</script>

<style src="../css/index.module.scss" lang="scss" module />
