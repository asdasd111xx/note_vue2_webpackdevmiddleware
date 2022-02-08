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
              :class="[{ [$style['active']]: currentImgID === item.image_id }]"
              :src="item.link"
              @click="selectImg(item)"
            />
            <div v-if="currentImgID === item.image_id" :class="$style.check" />
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
        // { url: "/static/image/common/mcenter/default/avatar_0.png" },
        // { url: "/static/image/common/mcenter/default/avatar_1.png" },
        // { url: "/static/image/common/mcenter/default/avatar_2.png" },
        // { url: "/static/image/common/mcenter/default/avatar_3.png" },
        // { url: "/static/image/common/mcenter/default/avatar_4.png" },
        // { url: "/static/image/common/mcenter/default/avatar_5.png" },
        // { url: "/static/image/common/mcenter/default/avatar_6.png" },
        // { url: "/static/image/common/mcenter/default/avatar_7.png" },
        // { url: "/static/image/common/mcenter/default/avatar_8.png" },
        // { url: "/static/image/common/mcenter/default/avatar_9.png" },
        // { url: "/static/image/common/mcenter/default/avatar_10.png" },
        // { url: "/static/image/common/mcenter/default/avatar_11.png" },
        // { url: "/static/image/common/mcenter/default/avatar_12.png" },
        // { url: "/static/image/common/mcenter/default/avatar_13.png" }
      ],
      isPageLoading: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    })
  },
  mounted() {
    this.actionGetExtRedirect({
      api_uri: "/api/platform/v1/head-photo/preset-list",
      method: "get"
    }).then(res => {
      if (res && res.result && res.result.data) {
        this.currentImgID = res.result.use;
        this.defaultAvatarList = res.result.data;
      }
    });
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionGetExtRedirect"
    ]),
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
    saveAvatar(item) {
      if (this.currentImgID === item.image_id) {
        this.onClose();
        return;
      }

      this.isPageLoading = true;

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/head-photo",
        method: "put",
        data: {
          image_file: "",
          head_photo_id: item.image_id
        }
      }).then(res => {
        if (res && !res.error_text) {
          this.onClose(item.image_id);
          setTimeout(() => {
            this.isPageLoading = false;
          }, 500);
        } else {
          this.actionSetGlobalMessage({ msg: res.error_text });
          this.isPageLoading = false;
        }
      });

      // goLangApiRequest({
      //   method: "put",
      //   url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player`,
      //   params: {
      //     image: index,
      //     custom: false
      //   }
      // }).then(res => {
      //   if (res && res.data && res.status === "000") {
      //     this.onClose(index);
      //     setTimeout(() => {
      //       this.isPageLoading = false;
      //     }, 500);
      //   } else {
      //     this.actionSetGlobalMessage({ msg: res.data.msg });
      //     this.isPageLoading = false;
      //   }
      // });
    },
    selectImg(item) {
      this.saveAvatar(item);
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
<style lang="scss" src="../css/sg1.avater.scss" module></style>
