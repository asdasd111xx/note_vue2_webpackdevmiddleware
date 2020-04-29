<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content" :class="$style['setting-wrap']">
      <div :class="$style['section']">
        <div
          v-if="loginStatus"
          :class="[$style['cell']]"
          :style="{ 'margin-bottom': '10px' }"
          @click="$router.push('/mobile/mcenter/help/detail?type=withdraw')"
        >
          <div :class="$style['title']">
            {{ $text("S_RECENTLY_WITHDRAW", "近10笔提现纪录") }}
          </div>
          <div :class="[$style['arrow-btn']]">
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </div>

        <div
          v-for="(item, index) in data"
          :id="`q-${index}`"
          :class="[$style['cell'], { [$style['active']]: item.isOpen }]"
          :key="item.key"
          @click="item.content && handleToggleContent(index)"
        >
          <div :class="$style['title']">
            {{ item.title }}
          </div>
          <div
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
            :style="{ 'max-height': item.isOpen ? `100vh` : 0 }"
            v-html="item.content"
          ></div>
          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../../../../common/new/mobileContainer';
import info from '../json/withdraw.json'
export default {
  components: {
    mobileContainer,
  },
  data() {
    return {
      isShowRecoard: false,
      data: info.data.map(function (el) {
        let _o = Object.assign({}, el);
        _o.isOpen = false;
        return _o;
      })
    };
  },
  mounted() {
    if (!info) this.$router.back();
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    isApp() {
      let isApp = !!((this.$route.query && this.$route.query.app) || (this.$route.query && this.$route.query.APP))
      if (isApp)
        document.title = "提现教程"

      return isApp
    },
    headerConfig() {
      if (!this.isApp)
        return {
          prev: true,
          onClick: () => { this.$router.back(); },
          title: '提现教程',
        };
    },
  },
  methods: {
    handleToggleContent(key) {
      let target = document.getElementById(`q-${key}`);
      if (!target) return;
      this.data[key].isOpen = !this.data[key].isOpen;
    }
  },
};
</script>

<style src="../css/index.module.scss" lang="scss" module>
