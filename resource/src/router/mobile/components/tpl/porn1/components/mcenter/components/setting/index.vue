<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['setting-wrap']">
      <div
        v-for="listInfo in list"
        :key="`list-${listInfo.name}`"
        :class="$style.list"
        @click="handleClick(listInfo.path)"
      >
        <span> {{ listInfo.name }} </span>
        <div :class="$style['btn-next']">
          <img :src="$getCdnPath(`/static/image/_new/common/btn_next.png`)" />
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/new/mobileContainer';
export default {
  components: {
    mobileContainer,
  },
  data() {
    return {
      list: [
        { name: this.$text('S_CHANGE_PASSWD', '代理登入'), path: '/mobile/resetPwd' },
        { name: this.$text('S_FEEDBACK', '意见反馈'), path: '/mobile/mcenter/feedback' },
      ],
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
        title: this.$text('S_SETTING', '设置'),
      };
    },
  },
  created() {

  },
  methods: {
    handleClick(path) {
      this.$router.push(path)
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  background-color: $main_background_white1;
}

.setting-wrap {
  color: $main_text_color3;

  .list {
    height: 50px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    background-color: $main_white_color1;

    > span {
      width: 100%;
    }
  }

  .btn-next {
    width: 14px;
    height: 100%;
    display: flex;
    align-items: center;
    > img {
      height: 14px;
      width: 14px;
    }
  }
}
</style>
