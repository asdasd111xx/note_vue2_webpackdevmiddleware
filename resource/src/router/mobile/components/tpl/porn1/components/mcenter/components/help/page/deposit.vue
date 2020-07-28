<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content">
      <div :class="$style['section']">
        <div
          v-if="hasCid"
          :class="[$style['cell']]"
          :style="{ 'margin-bottom': '10px' }"
          @click="
            $router.push(
              `/mobile/mcenter/help/detail?type=deposit${
                isApp ? '&app=true' : ''
              }`
            )
          "
        >
          <div :class="$style['title']">
            {{ $text("S_RECENTLY_DEPOSIT", "8日内充值记录") }}
          </div>
          <div :class="[$style['arrow-btn']]">
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
import { getCookie } from '@/lib/cookie';

export default {
  components: {
    mobileContainer,
  },
  data() {
    return {
      hasCid: false,
    };
  },
  mounted() {
    this.hasCid = getCookie('cid') || false;
    document.title = this.$text('S_HELP_CENTER', '帮助中心')
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    isApp() {
      let isApp = !!((this.$route.query && this.$route.query.app) || (this.$route.query && this.$route.query.APP))
      return isApp;
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_HELP_CENTER', '帮助中心'),
      };
    },
  },
};
</script>
<style src="../css/index.module.scss" lang="scss" module>
