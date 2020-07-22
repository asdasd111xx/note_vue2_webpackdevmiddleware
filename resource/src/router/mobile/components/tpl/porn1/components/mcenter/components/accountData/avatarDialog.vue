<template>
  <transition name="fade">
    <div v-show="isShow" :class="$style['dialog']">
      <div :class="[$style['dialog-wrap'], 'clearfix']">
        <div
          v-for="(item, index) in defaultAvatarList"
          :key="`avatar-${index}`"
          :class="$style['avatar-wrap']"
        >
          <img
            :class="[{ [$style['active']]: currentImgID === index }]"
            :src="$getCdnPath(item.url)"
            @click="selectImg(index)"
          />
          <div v-if="currentImgID === index" :class="$style.check" />
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
          <div @click="onClose">{{ $text("S_CANCEL", "取消") }}</div>
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
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import member from '@/api/member';
import axios from 'axios';
import avatarEditer from './avatarEditer';
export default {
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/tpl/porn1/components/common/new/pageLoading'),
    avatarEditer
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentImgID: 0,
      isShowAvatarEditer: false,
      defaultAvatarList: [
        { url: '/static/image/_new/mcenter/default/avatar_0.png' },
        { url: '/static/image/_new/mcenter/default/avatar_1.png' },
        { url: '/static/image/_new/mcenter/default/avatar_2.png' },
        { url: '/static/image/_new/mcenter/default/avatar_3.png' },
        { url: '/static/image/_new/mcenter/default/avatar_4.png' },
        { url: '/static/image/_new/mcenter/default/avatar_5.png' },
        { url: '/static/image/_new/mcenter/default/avatar_6.png' },
        { url: '/static/image/_new/mcenter/default/avatar_7.png' },
      ],
      isPageLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
    }),
  },
  mounted() {
    // 是否自訂上傳頭像
    if (this.memInfo.user.custom) {
      // ??
    }
    // 八張預設圖
    this.currentImgID = this.memInfo.user.image;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetGlobalMessage'
    ]),
    onClose() {
      this.$emit('close');
    },
    handleClickFunc(key) {
      // 暫時關閉
      //   this.actionSetGlobalMessage({ type: 'incoming' });
      //   return;

      if (key === "camera") {
        this.$refs['cameraInput'].click();
      } else if (key === "album") {
        this.isShowAvatarEditer = true;
      }
    },
    uploadImgChange(event) {
      this.isPageLoading = true;
      const img = event.target.files[0];
      this.isShowAvatarEditer = true;

      this.$nextTick(() => {
        this.$refs['avatar-editer'].option.img = URL.createObjectURL(img);
        this.isPageLoading = false;
        this.$refs['cameraInput'].value = null;
      })
    },
    saveAvatar(index) {
      if (this.memInfo.user.image === this.imgID) {
        this.onClose();
        return;
      }

      this.isPageLoading = true;
      mcenter.accountDataSet({
        params: { image: index, custom: false },
        success: () => {
          this.onClose();
          setTimeout(() => {
            this.isPageLoading = false;
          }, 500)
        },
        fail: (res) => {
          this.actionSetGlobalMessage({ msg: res.data.msg })
          this.isPageLoading = false;

        }
      }).then(() => {
        this.isPageLoading = false;
      });
    },
    selectImg(index) {
      this.currentImgID = index;
      this.saveAvatar(index)
    },
    handleCloseEditer(isDone) {
      this.actionSetUserdata(true);
      this.isShowAvatarEditer = false;
      if (isDone) {
        this.onClose();
      }
    },
    setPageLoading(set) {
      this.isPageLoading = set;
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
// avatar dialog
.dialog {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: rgba($color: #161616, $alpha: 0.4);
}

.dialog-wrap {
  width: 100%;
  position: absolute;
  padding: 0;
  z-index: 100;
  bottom: 0;
  max-width: $mobile_max_width;
  border-radius: 20px 20px 0 0;
  position: fixed;
  z-index: 100;
  min-height: 375px;
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
      width: 65px;
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

@media (orientation: landscape) {
  .dialog-wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}

.img-input {
  display: none;
  border: unset;
  outline: unset;
}
</style>
