<template>
  <div :class="$style['content-wrap']">
    <div :class="$style['mcenter-avatar-wrap']">
      <div>个人头像</div>
      <div :class="$style['avatar']" @click="isShowAvatarDialog = true">
        <img :src="avatarSrc" />
        <img :src="$getCdnPath(`/static/image/_new/mcenter/icon_edit.png`)" />
      </div>
    </div>

    <!-- 頭像編輯彈窗 -->
    <avatar-dialog v-if="isShowAvatarDialog" @close="handleCloseDialog" />
    <account />
    <service-tips />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import account from './account/index';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import serviceTips from './serviceTips';
import axios from 'axios';
import avatarDialog from './avatarDialog'

export default {
  components: {
    account,
    serviceTips,
    avatarDialog
  },
  data() {
    return {
      avatarSrc: `/static/image/_new/mcenter/avatar_nologin.png`,
      isShowAvatarDialog: false,
      isPageLoading: false,
    };
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push('/mobile/mcenter');
      return;
    }

    // 是否自訂上傳頭像
    if (this.memInfo.user.custom) {

    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: 'getMemInfo',
      memCurrency: 'getMemCurrency',
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_PERSON_INFO", "个人资料"),
      };
    },
  },
  mounted() {
    this.getAvatarSrc();
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetGlobalMessage'
    ]),
    getAvatarSrc() {
      if (!this.loginStatus) return;

      const imgSrcIndex = this.memInfo.user.image;
      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: 'get',
          url: this.memInfo.user.custom_image,
        }).then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.avatarSrc = res.data.ret;
          }
        }).catch(error => {
          this.actionSetGlobalMessage({ msg: error.data.msg });
          this.avatarSrc = this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`);
        })
      } else {
        this.avatarSrc = this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`);
      }
    },
    showAvatarDialog() {
      this.isShowAvatarDialog = !this.isShowAvatarDialog;
    },
    handleCloseDialog() {
      this.isShowAvatarDialog = false;

      this.actionSetUserdata(true).then(() => {
        this.getAvatarSrc();
      });
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
  border-bottom: 1px solid #eee;

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
</style>
