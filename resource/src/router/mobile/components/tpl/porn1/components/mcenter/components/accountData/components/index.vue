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
    <avatar-dialog v-if="isShowAvatarDialog" @close="handleCloseAvatarEditer" />
    <account />
    <service-tips />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import account from "./account/index";
import serviceTips from "./serviceTips";
import axios from "axios";
import avatarDialog from "./avatarDialog";

export default {
  components: {
    account,
    serviceTips,
    avatarDialog
  },
  data() {
    return {
      avatarSrc: `/static/image/common/default/avatar_nologin.png`,
      isShowAvatarDialog: false,
      isPageLoading: false
    };
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/mcenter");
      return;
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      memCurrency: "getMemCurrency"
    })
  },
  mounted() {
    this.getAvatarSrc();
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage"]),
    getAvatarSrc(index) {
      if (!this.loginStatus) return;

      const tmpCustomImage = localStorage.getItem("tmp-avatar-img");
      if (tmpCustomImage) {
        this.avatarSrc = tmpCustomImage;
        return;
      }

      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: "get",
          url: this.memInfo.user.custom_image
        })
          .then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.avatarSrc = res.data.ret;
            }
          })
          .catch(error => {
            this.actionSetGlobalMessage({ msg: error.data.msg });
            this.avatarSrc = this.$getCdnPath(
              `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
            );
          });
        return;
      }

      const imgSrcIndex = index || this.memInfo.user.image;
      this.avatarSrc = this.$getCdnPath(
        `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
      );
    },
    showAvatarDialog() {
      this.isShowAvatarDialog = !this.isShowAvatarDialog;
    },
    handleCloseAvatarEditer(tmpSelectAvatarIndex) {
      this.isShowAvatarDialog = false;

      this.actionSetUserdata(true).then(() => {
        this.getAvatarSrc(tmpSelectAvatarIndex);
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.content-wrap {
  background-color: #f8f8f8;
}

.mcenter-avatar-wrap {
  height: 120px;
  background-color: #fefffe;
  color: #414655;
  padding: 15px;
  border-bottom: 1px solid #eee;

  > .avatar {
    height: 56px;
    width: 56px;
    margin: 6px 0 13px;
    position: relative;

    > img:first-child {
      height: 56px;
      width: 56px;
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
