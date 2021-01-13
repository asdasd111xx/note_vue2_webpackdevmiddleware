<template>
  <transition name="fade">
    <div :class="$style['dialog']">
      <div :class="[$style['dialog-wrap'], 'clearfix']">
        <div
          v-for="(item, index) in defaultAvatarList"
          :key="`avatar-${index}`"
          :class="$style['avatar-wrap']"
        >
          <div :class="$style['avatar-cell']">
            <img
              :class="[{ [$style['active']]: currentImgID === index }]"
              :src="$getCdnPath(item.url)"
              @click="selectImg(index)"
            />
            <div v-if="currentImgID === index" :class="$style.check" />
          </div>
        </div>

        <div :class="$style['dialog-func']">
          <input
            @change="uploadImgChange"
            :class="$style['img-input']"
            ref="cameraInput"
            type="file"
            accept="image/*"
            capture="camera"
          />
          <div @click="handleClickFunc('album')">
            从相册选取
          </div>
          <div @click="handleClickFunc('camera')">拍照</div>
          <div @click="onClose()">{{ $text("S_CANCEL", "取消") }}</div>
        </div>
      </div>
      <avatar-editer
        v-if="isShowAvatarEditer"
        ref="avatar-editer"
        @setPageLoading="setPageLoading"
        @close="handleCloseEditer"
      />
      <page-loading :is-show="isPageLoading" />
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mcenter from "@/api/mcenter";
import member from "@/api/member";
import axios from "axios";
import avatarEditer from "./avatarEditer";
export default {
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    avatarEditer
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentImgID: 999,
      isShowAvatarEditer: false,
      defaultAvatarList: [
        { url: "/static/image/common/mcenter/default/avatar_0.png" },
        { url: "/static/image/common/mcenter/default/avatar_1.png" },
        { url: "/static/image/common/mcenter/default/avatar_2.png" },
        { url: "/static/image/common/mcenter/default/avatar_3.png" },
        { url: "/static/image/common/mcenter/default/avatar_4.png" },
        { url: "/static/image/common/mcenter/default/avatar_5.png" },
        { url: "/static/image/common/mcenter/default/avatar_6.png" },
        { url: "/static/image/common/mcenter/default/avatar_7.png" }
      ],
      isPageLoading: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    }
  },
  mounted() {
    // 是否自訂上傳頭像
    // 八張預設圖
    this.actionSetUserdata(true).then(() => {
      this.currentImgID = this.memInfo.user.custom
        ? "999"
        : this.memInfo.user.image;
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage"]),
    onClose(index) {
      localStorage.removeItem("tmp-avatar-img");
      this.$emit("close", index);
    },
    handleClickFunc(key) {
      if (key === "camera") {
        this.$refs["cameraInput"].click();
      } else if (key === "album") {
        this.isShowAvatarEditer = true;
      }
    },
    uploadImgChange(event) {
      this.isPageLoading = true;
      const img = event.target.files[0];
      this.isShowAvatarEditer = true;

      this.$nextTick(() => {
        this.$refs["avatar-editer"].option.img = URL.createObjectURL(img);
        this.isPageLoading = false;
        this.$refs["cameraInput"].value = null;
      });
    },
    saveAvatar(index) {
      if (this.memInfo.user.image === this.imgID) {
        this.onClose();
        return;
      }

      this.isPageLoading = true;
      mcenter
        .accountDataSet({
          params: { image: index, custom: false },
          success: () => {
            this.onClose(index);
            setTimeout(() => {
              this.isPageLoading = false;
            }, 500);
          },
          fail: res => {
            this.actionSetGlobalMessage({ msg: res.data.msg });
            this.isPageLoading = false;
          }
        })
        .then(() => {
          this.isPageLoading = false;
        });
    },
    selectImg(index) {
      this.currentImgID = index;
      this.saveAvatar(index);
    },
    handleCloseEditer(isDone) {
      this.actionSetUserdata(true);
      this.isShowAvatarEditer = false;
      if (isDone) {
        this.$nextTick(() => {
          this.onClose();
        });
      }
    },
    setPageLoading(set) {
      this.isPageLoading = set;
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.avater.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.avater.scss" module="$style_ey1"></style>
<style lang="scss" src="../css/sg1.avater.scss" module="$style_sg1"></style>
