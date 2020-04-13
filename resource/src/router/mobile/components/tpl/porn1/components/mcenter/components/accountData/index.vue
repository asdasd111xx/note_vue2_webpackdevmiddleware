<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <div v-if="isShow" :class="$style['dialog-mask']" />
      <div v-if="isShow" :class="[$style['dialog-wrap'], 'clearfix']">
        <div
          v-for="(avatarList, index) in avatar"
          :key="`avatar-${avatarList}`"
          :class="$style['avatar-wrap']"
        >
          <img :src="$getCdnPath(avatarList.url)" @click="selectImg(index)" />
          <div v-if="imgID === index + 1" :class="$style.check" />
        </div>
      </div>

      <div :class="$style['mcenter-avatar-wrap']">
        <div>个人头像</div>
        <div :class="$style['avatar']" @click="dialogShow()">
          <img :src="avatarSrc" />
          <img :src="$getCdnPath(`/static/image/_new/mcenter/icon_edit.png`)" />
        </div>
      </div>

      <account />
    </div>
  </mobile-container>
</template>

<script>
import account from './account/index';
import mobileContainer from '../../../common/new/mobileContainer';
import member from '@/api/member';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    mobileContainer,
    account
  },
  data() {
    return {
      isShow: false,
      avatar: [
        { image: 'avatar_1', url: '/static/image/mobile/tpl/theme3/home/avatar_1.png' },
        { image: 'avatar_2', url: '/static/image/mobile/tpl/theme3/home/avatar_2.png' },
        { image: 'avatar_3', url: '/static/image/mobile/tpl/theme3/home/avatar_3.png' },
        { image: 'avatar_4', url: '/static/image/mobile/tpl/theme3/home/avatar_4.png' },
        { image: 'avatar_5', url: '/static/image/mobile/tpl/theme3/home/avatar_5.png' },
        { image: 'avatar_6', url: '/static/image/mobile/tpl/theme3/home/avatar_6.png' }
      ],
      imgID: 0,
      imgIndex: 0
    };
  },
  created() {
    if (this.memInfo.user.image === 0 || !(this.memInfo.user.image)) {
      this.imgIndex = 1;
      this.imgID = 1;
      return;
    }
    this.imgIndex = this.memInfo.user.image;
    this.imgID = this.memInfo.user.image;
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      memCurrency: 'getMemCurrency',
    }),
    avatarSrc() {
      return this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${this.imgIndex}.png`)
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_PERSON_INFO", "个人资料"),
      };
    },
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    selectImg(index) {
      this.imgID = index + 1;
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  min-height: calc(100vh);
  background-color: $main_background_white1;
}

.mcenter-avatar-wrap {
  height: 120px;
  background-color: $main_white_color1;
  color: $main_text_color3;
  padding: 15px;

  > .avatar {
    height: 56px;
    width: 56px;
    margin: 10px 0;
    position: relative;
    > img:first-child {
      height: 100%;
      border-radius: 50%;
    }

    > img:last-child {
      width: 17px;
      height: 17px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
</style>
