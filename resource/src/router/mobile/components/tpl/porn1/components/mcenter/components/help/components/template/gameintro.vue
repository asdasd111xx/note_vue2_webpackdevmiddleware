<template>
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
        v-for="(item, index) in lists[currentIndex].list"
        :id="`q-${item.key}`"
        :class="$style['cell']"
        :key="item.key"
        @click="handleToggleContent(item.key)"
      >
        <div :class="$style['cell-header']">
          <div :class="$style['title-icon']">
            <img
              :src="$getCdnPath('/static/image/_new/mcenter/ic_help.png')"
              alt="help"
            />
          </div>

          <div :class="$style['title']">
            {{ item.title }}
          </div>
        </div>

        <div
          :class="[$style['content'], { [$style['active']]: item.isOpen }]"
          :style="{ 'max-height': item.isOpen ? `100%` : 0 }"
        >
          <div
            v-for="(item, index) in item.content"
            :class="$style['text-block']"
            v-html="item"
          />
        </div>

        <div
          :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
        >
          <img
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
          />
        </div>
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
</template>

<script>
import info from "../../json/gameintro.json";

export default {
  components: {
  },
  data() {
    return {
      currentIndex: 0,
      isShowPop: false,
      lists: info.data
    };
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
    }
  },
  methods: {
    setType(index) {
      this.currentIndex = index;
      this.isShowPop = false;
    },
    handleToggleContent(key) {
      let target = document.getElementById(`q-${key}`);
      if (!target) return;

      this.lists[this.currentIndex].list.forEach((element, index) => {
        if (Number(element.key) === Number(key)) {
          element.isOpen = !element.isOpen;
        }
      });
    },
    addSwitchToList() {
      let tempList = this.lists[this.currentIndex].list.map(el => {
        let _o = Object.assign({}, el);
        _o.isOpen = false;
        return _o;
      });
      this.lists[this.currentIndex].list = tempList;
    }
  },
  watch: {
    currentIndex() {
      this.addSwitchToList();
    }
  },
  mounted() {
    if (!info) this.$router.back();
    this.addSwitchToList();
  }
};
</script>

<style src="../../css/index.module.scss" lang="scss" module>
