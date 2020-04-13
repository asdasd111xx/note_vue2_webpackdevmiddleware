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

      <!-- avatar dialog -->
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

        <div :class="$style['dialog-func']">
          <div @click="isShow = false">从相册选取</div>
          <div @click="isShow = false">拍照</div>
          <div @click="isShow = false">{{ $text("S_CANCEL", "取消") }}</div>
        </div>
      </div>

      <account />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import account from './account/index';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
  components: {
    mobileContainer,
    account
  },
  data() {
    return {
      isShow: false,
      avatar: [
        { image: 'avatar_0', url: '/static/image/_new/mcenter/default/avatar_0.png' },
        { image: 'avatar_1', url: '/static/image/_new/mcenter/default/avatar_1.png' },
        { image: 'avatar_2', url: '/static/image/_new/mcenter/default/avatar_2.png' },
        { image: 'avatar_3', url: '/static/image/_new/mcenter/default/avatar_3.png' },
        { image: 'avatar_4', url: '/static/image/_new/mcenter/default/avatar_4.png' },
        { image: 'avatar_5', url: '/static/image/_new/mcenter/default/avatar_5.png' },
        { image: 'avatar_6', url: '/static/image/_new/mcenter/default/avatar_6.png' },
        { image: 'avatar_7', url: '/static/image/_new/mcenter/default/avatar_7.png' },
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
    dialogShow() {
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
  bottom: 0;
  left: 0;
  top: unset;
  width: 100%;
  border-radius: 20px 20px 0 0;
  position: absolute;
  z-index: 999;
  min-height: 400px;
  height: 40%;
  background-color: $main_background_white1;

  .dialog-func {
    margin-top: 15px;
    text-align: center;
    color: #5e626d;
    font-size: 17px;
    height: 50px;
    line-height: 50px;

    > div {
      background-color: $main_white_color1;
      width: 100%;
    }

    > div:last-child {
      margin-top: 25px;
      color: black;
    }
  }

  .avatar-wrap {
    position: relative;
    display: inline-block;
    width: 25%;
    text-align: center;
    img {
      border-radius: 50%;
      width: 90%;
      padding: 5%;
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
