<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" :class="$style['setting-wrap']">
      <div :class="$style['section']">
        <div
          v-if="loginStatus"
          :class="[$style['cell']]"
          :style="{ 'margin-bottom': '10px' }"
          @click="$router.push('/mobile/mcenter/help/detail?type=deposit')"
        >
          <div :class="$style['title']">
            {{ $text("S_RECENTLY_DEPOSIT", "近10笔充值纪录") }}
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

export default {
  components: {
    mobileContainer,
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: '充值教程'
      };
    },
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  background-color: $main_background_white1;
}
</style>
