<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <div class="information-wrap">
        <div
          v-if="!$route.params.pid"
          :class="[$style['menu-list-wrap'], 'clearfix']"
        >
          <div
            :class="$style['menu-list']"
            @click="$router.push({ params: { page: 'message' } })"
          >
            <div
              :class="[
                $style['menu-title'],
                { [$style.active]: $route.params.page === 'message' }
              ]"
            >
              通知
            </div>
            <div v-if="memInfo.msgCount" :class="$style['menu-tips']">
              {{ memInfo.msgCount }}
            </div>
          </div>
          <div
            :class="$style['menu-list']"
            @click="$router.push({ params: { page: 'news' } })"
          >
            <div
              :class="[
                $style['menu-title'],
                { [$style.active]: $route.params.page === 'news' }
              ]"
            >
              活动
            </div>
          </div>
          <div
            :class="$style['menu-list']"
            @click="$router.push({ params: { page: 'post' } })"
          >
            <div
              :class="[
                $style['menu-title'],
                { [$style.active]: $route.params.page === 'post' }
              ]"
            >
              公告
            </div>
          </div>
        </div>
        <component :is="$route.params.page" />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import message from './components/message/index';
import mobileContainer from '../../../common/new/mobileContainer';
import news from './components/news/index';
import post from './components/post/index';
export default {
  components: {
    mobileContainer,
    message,
    news,
    post
  },
  created() {
    if (['message', 'news', 'post'].includes(this.$route.params.page)) {
      this.actionSetMcenterMsgCount();
      return;
    }

    this.$router.push('/mobile/mcenter/information/message');
  },
  methods: {
    ...mapActions([
      'actionSetMcenterMsgCount'
    ])
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      const trans = { message: '通知', news: '活动', post: '公告' };

      return {
        prev: true,
        title: this.$route.params.pid ? trans[this.$route.params.page] : '消息中心',
        onClick: () => {
          if (this.$route.params.pid) {
            this.$router.back();
            return;
          }

          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.$router.push('/mobile/mcenter/home');
        }
      };
    }
  }
};
</script>
<style lang="scss" src="./css/index.scss" module />
