<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <!-- 頭像選擇 -->
      <div
        v-if="isShow"
        :class="$style['dialog-mask']"
        @click="selectAvatar()"
      />
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
    if (this.memInfo.user.image === 0) {
      //   this.imgIndex = 1;
      //   this.imgID = 1;
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
      return this.imgIndex == 0 ?
        this.$getCdnPath(`/static/image/_new/mcenter/avatar_nologin.png`) :
        this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${this.imgIndex}.png`)
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

    dialogShow() {
      return;

      // to do 修改大頭
      this.isShow = !this.isShow;
    },
    selectAvatar() {
      if (this.memInfo.user.image === this.imgID) {
        this.dialogShow();
        return;
      }

      mcenter.accountDataSet({
        params: { image: this.imgID },
        success: () => {
          this.actionSetUserdata();
          this.dialogShow();
          this.imgIndex = this.imgID;
        }
      });
    },
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
// avatar dialog
.dialog-mask,
.dialog-wrap {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  background: #000;
  z-index: 999;
}
.dialog-mask {
  width: 100%;
  height: 100%;
  opacity: 0.5;
}
.dialog-wrap {
  top: 40%;
  left: 50%;
  border-radius: 10px;
  padding: 10px;
  background: #f8f1eb;
  width: 90%;
  color: #999;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  .avatar-wrap {
    position: relative;
    float: left;
    margin: 6px 1%;
    background: url("/static/image/mobile/tpl/porn1/home/avatar_bg.png") 0 0
      no-repeat;
    background-size: 100%;
    width: 31%;
    text-align: center;
    img {
      border-radius: 50%;
      margin-top: 5%;
      width: 90%;
    }
    .check {
      position: absolute;
      bottom: -6%;
      left: 50%;
      background: url("/static/image/mobile/tpl/porn1/home/check_icon.png") 0 0
        no-repeat;
      background-size: 100%;
      width: 30%;
      height: 29%;
      -webkit-transform: translate(-50%, 0);
      transform: translate(-50%, 0);
    }
  }
}
</style>
