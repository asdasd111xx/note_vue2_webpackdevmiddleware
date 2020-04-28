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
          <img :src="$getCdnPath(avatarList.url)" @click="selectImg(index + 1)" />
          <div v-if="imgID - 1 === index" :class="$style.check" />
        </div>
      </div>

      <div :class="$style['mcenter-avatar-wrap']">
        <div>个人头像</div>
        <div :class="$style['avatar']" @click="dialogShow()">
          <img :src="avatarSrc" />
          <img :src="$getCdnPath(`/static/image/_new/mcenter/icon_edit.png`)" />
        </div>
        <message v-if="msg" @close="msg = ''"
          ><div slot="msg">{{ msg }}</div>
        </message>
      </div>

      <!-- avatar dialog -->
      <div v-if="isShow" :class="$style['dialog-mask']" @click="saveAvatar()" />
      <div v-if="isShow" :class="[$style['dialog-wrap'], 'clearfix']">
        <div
          v-for="(avatarList, index) in avatar"
          :key="`avatar-${avatarList}`"
          :class="$style['avatar-wrap']"
        >
          <img
            :class="[{ [$style['active']]: imgID === index }]"
            :src="$getCdnPath(avatarList.url)"
            @click="selectImg(index + 1)"
          />
          <div v-if="imgID - 1 === index" :class="$style.check" />
        </div>

        <div :class="$style['dialog-func']">
          <div @click="handleClickFunc">从相册选取</div>
          <div @click="handleClickFunc">拍照</div>
          <div @click="isShow = false">{{ $text("S_CANCEL", "取消") }}</div>
        </div>
      </div>

      <account />
      <service-tips />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import account from './account/index';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import mobileContainer from '../../../common/new/mobileContainer';
import message from '../../../common/new/message'
import serviceTips from './serviceTips'

export default {
  components: {
    mobileContainer,
    account,
    message,
    serviceTips
  },
  data() {
    return {
      msg: "",
      isShow: false,
      avatar: [
        { image: 'avatar_1', url: '/static/image/_new/mcenter/default/avatar_1.png' },
        { image: 'avatar_2', url: '/static/image/_new/mcenter/default/avatar_2.png' },
        { image: 'avatar_3', url: '/static/image/_new/mcenter/default/avatar_3.png' },
        { image: 'avatar_4', url: '/static/image/_new/mcenter/default/avatar_4.png' },
        { image: 'avatar_5', url: '/static/image/_new/mcenter/default/avatar_5.png' },
        { image: 'avatar_6', url: '/static/image/_new/mcenter/default/avatar_6.png' },
        { image: 'avatar_7', url: '/static/image/_new/mcenter/default/avatar_7.png' },
        { image: 'avatar_8', url: '/static/image/_new/mcenter/default/avatar_8.png' },
      ],
      imgID: 0,
      imgIndex: 0
    };
  },
  created() {
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
    handleClickFunc() {
      this.isShow = false;
      this.msg = this.$text('S_COMING_SOON2', '正在上线 敬请期待');
    },
    dialogShow() {
      this.isShow = !this.isShow;
    },
    saveAvatar() {
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
      this.imgID = index;
      this.saveAvatar()
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
  border-bottom: 1px solid #EEE;

  > .avatar {
    height: 56px;
    width: 56px;
    margin: 6px 0 13px;
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
  opacity: 0.4;
}
.dialog-wrap {
  bottom: 0;
  left: 0;
  top: unset;
  width: 100%;
  border-radius: 20px 20px 0 0;
  position: fixed;
  z-index: 999;
  min-height: 400px;
  height: 40%;
  background-color: $main_background_white1;

  .dialog-func {
    text-align: center;
    color: $main_text_color4;
    font-size: 17px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    > div:first {
      padding-top: 1px;
    }

    > div {
      background-color: $main_white_color1;
      width: 100%;
      height: 50px;
      line-height: 50px;
    }

    > div:last-child {
      margin-top: 20px;
      color: black;
    }
  }

  .avatar-wrap {
    position: relative;
    display: inline-block;
    width: 25%;
    padding-top: 2.5px;

    text-align: center;
    img {
      border-radius: 50%;
      width: 75%;
      max-width: 100px;
      margin: 5%;
      &.active {
        border: 2px solid transparent;
        border-color: #d2b79c;
      }
    }

    .check {
      position: absolute;
      bottom: 10%;
      right: 5%;
      background: url("/static/image/_new/mcenter/ic_check.png") 0 0 no-repeat;
      background-size: 100%;
      width: 18px;
      height: 18px;
      -webkit-transform: translate(-50%, 0);
      transform: translate(-50%, 0);
    }
  }
}
</style>
