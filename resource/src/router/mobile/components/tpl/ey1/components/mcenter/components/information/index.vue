<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
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
                { [$style.active]: currentTemplate === item.key }
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
              left: `calc(16.5% + 33% * ${currentTab})`
            }"
          />
        </div>

        <component :is="currentTemplate" />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mobileContainer from '../../../common/mobileContainer';
import news from './components/news/index';
import post from './components/post/index';

export default {
  components: {
    mobileContainer,
    news,
    post
  },
  data() {
    return {
      msgCount: 0,
      currentTab: 0, // 'message', 'news', 'post'
      currentTemplate: 'message'
    }
  },
  created() {
    this.actionSetMcenterMsgCount();
  },
  methods: {
    ...mapActions([
      'actionSetMcenterMsgCount'
    ]),
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.currentTemplate = 'message'
          break;

        case 1:
          this.currentTemplate = 'news'
          break;

        case 2:
          this.currentTemplate = 'post'
          break;
      }
    }
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      const trans = { message: '通知', news: '活动', post: '公告' };

      return {
        prev: true,
        title: this.$route.query.pid ? trans[this.currentTemplate] : '消息中心',
        onClick: () => {
          this.$router.back();
        }
      };
    },
    tabItem() {
      return [
        {
          key: 'message',
          text: '通知',
          hasMsgCount: true
        },
        {
          key: 'news',
          text: '活动'
        },
        {
          key: 'post',
          text: '公告'
        }
      ]
    }
  }
};
</script>
<style lang="scss" src="./css/index.scss" module />
